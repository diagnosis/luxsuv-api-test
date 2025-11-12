import { test as base } from '@playwright/test';
import { AuthApi } from "@/clients/auth-api";
import { MailpitApi } from "@/clients/mailpit";
import { RiderActions } from "@/actions/rider-actions";
import { MailActions } from "@/actions/mail-actions";
import { DriverActions } from "@/actions/driver-actions";
import { AdminActions } from "@/actions/admin-actions";


type Fixtures = {
    authApi: AuthApi;
    mailpitApi: MailpitApi;
    rider: RiderActions;
    mail: MailActions;
    driver: DriverActions;
    admin: AdminActions;
};

export const test = base.extend<Fixtures>({
    authApi: async ({}, use) => use(new AuthApi()),
    mailpitApi: async ({}, use) => use(new MailpitApi()),
    rider: async ({}, use) => use(new RiderActions()),
    mail: async ({}, use) => use(new MailActions()),
    driver: async ({}, use) => use(new DriverActions()),
    admin: async ({}, use) => use(new AdminActions()),
});

export { expect } from '@playwright/test';

