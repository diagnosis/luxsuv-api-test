import { httpMailpit } from "@/clients/http";

export class MailpitApi {
    search(email: string) {
        return httpMailpit.get('/search', { params: { query: email } });
    }

    getMessageById(id: string) {
        return httpMailpit.get(`/message/${id}`);
    }
}