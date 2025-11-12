import axios from 'axios';

export const httpApi = axios.create({
    baseURL: process.env.API_BASE,
    timeout: 15_000,
    validateStatus: () => true,
});

export const httpMailpit = axios.create({
    baseURL: process.env.MAILPIT_BASE,
    timeout: 15_000,
    validateStatus: () => true,
});

httpApi.interceptors.response.use((res) => {
    if (res?.data && typeof res.data === 'object' && 'data' in res.data) {
        res.data = res.data.data;
    }
    return res;
});
