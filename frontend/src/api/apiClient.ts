// project-handi/frontend/src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create
(
    {
        baseURL: 'http://localhost:5000/api/v1',
        headers: 
        {
            'Content-Type': 'application/json'
        }
    }
);

// Ajoute automatiquement le token s'il existe dans le localStorage
apiClient.interceptors.request.use
(
    (config) => 
    {
        const token = localStorage.getItem('token');
        if (token) 
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

export default apiClient;