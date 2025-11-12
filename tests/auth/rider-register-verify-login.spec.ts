import { test, expect } from '@/fixtures/clients';

const uniqueEmail = (p: string) => `${p}-${Date.now()}@example.test`;

test('rider register -> verify (Mailpit) -> login', async ({ rider }) => {
    const email = uniqueEmail('test-rider');
    const password = process.env.TEST_PASSWORD!;

    const result = await test.step('Register + Verify + Login rider', async () => {
        return rider.registerVerifyLogin(email, password);
    });

    await test.step('Assert rider has an access token', async () => {
        expect(result.accessToken, 'rider access token').toBeTruthy();
    });
});

test('driver register -> verify -> admin approves -> driver can login', async ({ driver, admin }) => {
    const email = uniqueEmail('test-driver');
    const password = process.env.TEST_PASSWORD!;

    await test.step('Register + Verify driver', async () => {
        await driver.registerVerify(email, password);
    });

    await test.step('Admin approves application', async () => {
        await admin.reviewAndApproveReject(email, 'approve');
    });

    const login = await test.step('Driver logs in after approval', async () => {
        return driver.login(email, password);
    });

    await test.step('Assert driver received token (and optional role)', async () => {
        expect(login.accessToken, 'driver access token').toBeTruthy();
        // If your API returns role in `login.user.role`
        if (login.user?.role) expect(login.user.role).toBe('driver');
    });
});