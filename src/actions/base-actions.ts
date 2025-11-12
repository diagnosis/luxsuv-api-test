// src/actions/base-actions.ts
import { AuthApi } from "@/clients/auth-api";
import { MailActions } from "@/actions/mail-actions";

export type VerifyPurpose = "rider_confirm" | "driver_confirm";

export class BaseActions {
    protected auth: AuthApi;
    protected mail: MailActions;

    constructor(auth: AuthApi = new AuthApi(), mail: MailActions = new MailActions()) {
        this.auth = auth;
        this.mail = mail;
    }

    protected sleep(ms: number): Promise<void> {
        return new Promise((res) => setTimeout(res, ms));
    }

    uniqueMail(prefix: string): string {
        return `${prefix}-${Date.now()}@example.test`;
    }

    async getVerifyURL(email: string): Promise<string> {
        const full = await this.mail.waitAndGetFirstFull(email);

        const html: string = full?.HTML ?? "";
        const text: string = full?.Text ?? "";

        const verifyUrl = this.mail.extractVerifyLink(html || text);
        if (!verifyUrl) {
            throw new Error(`Verification link not found in email for ${email}`);
        }

        return verifyUrl.replace(/\\u0026|&amp;/g, "&");
    }

    async verifyEmail(verifyUrl: string, defaultPurpose: VerifyPurpose = "rider_confirm"): Promise<any> {
        const url = new URL(verifyUrl);
        const token = url.searchParams.get("token");
        const parsedPurpose = (url.searchParams.get("purpose") as VerifyPurpose) || defaultPurpose;

        if (!token) {
            throw new Error("Verification token missing in URL");
        }

        const res = await this.auth.verify(token, parsedPurpose);
        if (res.status !== 200) {
            throw new Error(`Email verification failed: ${res.status}`);
        }
        return res;
    }

    async login(email: string, password: string) {
        const login = await this.auth.login(email, password);
        if (login.status !== 200) {
            throw new Error(`Login failed: ${login.status}`);
        }
        return {
            accessToken: login.data?.access_token,
            user: login.data?.user,
            raw: login.data,
        };
    }
}