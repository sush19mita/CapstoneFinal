import axios from 'axios';

const GATEWAY = 'http://localhost:8000';

const userApi = axios.create({ baseURL: GATEWAY });
const eventApi = axios.create({ baseURL: GATEWAY });
const bookingApi = axios.create({ baseURL: GATEWAY });

const addAuth = (config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

userApi.interceptors.request.use(addAuth);
eventApi.interceptors.request.use(addAuth);
bookingApi.interceptors.request.use(addAuth);

export { userApi, eventApi, bookingApi };