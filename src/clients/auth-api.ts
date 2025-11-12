import { httpApi } from "@/clients/http";

export class AuthApi {
    setBearer(token: string): void {
        httpApi.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    clearBearer(): void {
        delete httpApi.defaults.headers.common.Authorization;
    }

    registerRider(email: string, password: string) {
        return httpApi.post("/auth/register/rider", { email, password });
    }

    registerDriver(email: string, password: string) {
        return httpApi.post("/auth/register/driver", { email, password });
    }

    verify(token: string, purpose: "rider_confirm" | "driver_confirm") {
        return httpApi.get("/auth/verify", { params: { token, purpose } });
    }

    login(email: string, password: string) {
        return httpApi.post("/auth/login", { email, password });
    }

    logout() {
        return httpApi.post("/auth/logout");
    }
}