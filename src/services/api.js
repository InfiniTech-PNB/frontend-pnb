import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: import.meta.env.VITE_API_BASE_URL ||"https://api.mzdev.in/api",
    withCredentials: true
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});


export default API;