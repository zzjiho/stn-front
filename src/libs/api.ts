import type {AxiosInstance} from 'axios';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/onboarding/api';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;