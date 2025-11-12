// src/clients/mailpit.ts
import { httpMailpit } from "@/clients/http";


export class MailpitApi {
    search(email: string) {
        // ✅ correct param name; no manual encodeURIComponent
        return httpMailpit.get('/search', { params: { query: email } });
    }
    getMessageById(id: string) {
        return httpMailpit.get(`/message/${id}`);
    }
}