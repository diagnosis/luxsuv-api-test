import {BaseActions} from "@/actions/base-actions";
import {AuthApi} from "@/clients/auth-api";
import {MailActions} from "@/actions/mail-actions";


export class RiderActions extends BaseActions{
    constructor(private authApi: AuthApi = new AuthApi(), private mailActions: MailActions = new MailActions()) {
        super(authApi, mailActions);
    }
    async register(email:string, password:string){
        const reg = await this.auth.registerRider(email, password)
        if (reg.status !== 201) throw new Error(`register failed:${reg.status}`)
    }

    async registerVerifyLogin(email: string, password: string){
        await this.register(email, password)
        const verifyUrl = await this.getVerifyURL(email)
        await this.verifyEmail(verifyUrl,"rider_confirm")
        return this.login(email, password)
    }

}