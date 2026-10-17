import axios from 'axios';
const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const API = axios.create({
    baseURL: BASE_API_URL,
    headers : {
        'Content-type': 'Application/json'
    },
    timeout: 100000,
})

API.interceptors.request.use(
    (config) =>  {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

export default API