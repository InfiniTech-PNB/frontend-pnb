import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: import.meta.env.VITE_API_BASE_URL ||"http://ec2-16-112-159-207.ap-south-2.compute.amazonaws.com:3000/api",
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