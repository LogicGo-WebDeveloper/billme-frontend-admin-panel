import axios from 'axios';
import { API_USER } from './api-routes.config';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_USER,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error status codes
            switch (error.response.status) {
                case 401:
                    // Auth pages ke paths
                    const AUTH_PATHS = [
                        '/login',
                        '/signup',
                        '/verify-otp',
                        '/forget-password',
                        '/change-password',
                        'verification-success'
                    ];
                    const currentPath = window.location.pathname;
                    if (!AUTH_PATHS.includes(currentPath)) {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    // Handle forbidden access
                    console.error('Forbidden access');
                    break;
                case 404:
                    // Handle not found
                    console.error('Resource not found');
                    break;
                case 500:
                    // Handle server error
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 