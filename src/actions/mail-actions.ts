// src/actions/mail-actions.ts
import { MailpitApi } from "@/clients/mailpit";

export class MailActions {
    private mailpit: MailpitApi;

    constructor(mailpit: MailpitApi = new MailpitApi()) {
        this.mailpit = mailpit;
    }

    protected sleep(ms: number): Promise<void> {
        return new Promise((res) => setTimeout(res, ms));
    }

    /**
     * Poll Mailpit for the first message to `email`. Optionally require a subject substring.
     */
    async waitAndGetFirstFull(
        email: string,
        timeoutMs = 20_000,
        stepMs = 600,
        subjectIncludes?: string
    ) {
        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const r = await this.mailpit.search(email);
            const hits = r.data?.messages ?? [];
            // Pick the newest that matches subject (if provided)
            const hit = hits.find((m: any) =>
                subjectIncludes ? (m.Subject || m.subject || "").includes(subjectIncludes) : true
            );

            if (r.status === 200 && hit?.ID) {
                const full = await this.mailpit.getMessageById(hit.ID);
                if (full.status === 200) return full.data; // { HTML, Text, ... }
            }
            await this.sleep(stepMs);
        }
        throw new Error(`No mail for "${email}" within ${timeoutMs}ms`);
    }

    extractVerifyLink(htmlOrText: string): string | null {
        const rx = [
            /href="(https?:\/\/[^"]*\/api\/v1\/auth\/verify\?[^"]+)"/i,
            /(https?:\/\/[^\s"'<>]+\/api\/v1\/auth\/verify\?[^\s"'<>]+)/i,
        ];
        for (const r of rx) {
            const m = htmlOrText?.match(r);
            if (m) return m[1].replace(/\\u0026|&amp;/g, "&");
        }
        return null;
    }
}