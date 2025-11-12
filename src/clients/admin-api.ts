// src/clients/admin-api.ts
import axios, { AxiosInstance } from "axios";

export class AdminApi {
    private client: AxiosInstance;

    constructor(token?: string) {
        this.client = axios.create({
            baseURL: process.env.API_BASE,
            timeout: 15_000,
            validateStatus: () => true,
        });
        if (token) this.setBearer(token);
    }

    setBearer(token: string) {
        this.client.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    clearBearer() {
        delete this.client.defaults.headers.common.Authorization;
    }

    reviewDriverApplication(appId: string, action: "approve" | "reject", notes?: string) {
        return this.client.patch(`/admin/driver-applications/${appId}`, { action, notes });
    }
}