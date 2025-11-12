import { BaseActions } from "@/actions/base-actions";
import { MailActions } from "@/actions/mail-actions";
import { AdminApi } from "@/clients/admin-api";

export class AdminActions extends BaseActions {
    private adminApi: AdminApi;

    constructor(mailActions: MailActions = new MailActions(), adminApi: AdminApi = new AdminApi()) {
        super(undefined, mailActions);
        this.adminApi = adminApi;
    }

    private extractApplicationId(textOrHtml: string): string | null {
        const rx = [
            /\bApplicationID:\s*([0-9a-f-]{36})/i,
            /<strong>\s*ApplicationID:\s*<\/strong>\s*([0-9a-f-]{36})/i,
        ];
        for (const r of rx) {
            const m = textOrHtml?.match(r);
            if (m?.[1]) return m[1];
        }
        return null;
    }

    private async findDriverAppIdByEmail(driverEmail: string, timeoutMs = 20_000): Promise<string> {
        const full = await this.mail.waitAndGetFirstFull(driverEmail, timeoutMs, 800);
        const body = (full?.Text ?? "") + "\n" + (full?.HTML ?? "");
        const appId = this.extractApplicationId(body);
        if (!appId) {
            throw new Error(`ApplicationID not found for ${driverEmail}`);
        }
        return appId;
    }

    /**
     * Logs in as admin, finds the driver's application by reading the verification email,
     * and approves or rejects it. Returns the HTTP response for assertions.
     */
    async reviewAndApproveReject(
        driverEmail: string,
        action: "approve" | "reject",
        notes?: string
    ) {
        const adminEmail = process.env.ADMIN_EMAIL!;
        const adminPass = process.env.ADMIN_PASS!;
        const { accessToken } = await this.login(adminEmail, adminPass);

        this.adminApi.setBearer(accessToken);

        try {
            const appId = await this.findDriverAppIdByEmail(driverEmail);
            const res = await this.adminApi.reviewDriverApplication(appId, action, notes);

            if (res.status !== 200) {
                throw new Error(
                    `Driver application ${action} failed: ${res.status} ${JSON.stringify(res.data)}`
                );
            }

            return { appId, res };
        } finally {
            this.adminApi.clearBearer();
        }
    }
}