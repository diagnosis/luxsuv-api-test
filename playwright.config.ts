import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

// 👇 this must run before defineConfig
dotenv.config({ path: process.env.DOTENV_PATH || '.env' });

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    workers: 1,
    reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});