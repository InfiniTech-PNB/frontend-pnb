import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "http://ec2-40-192-14-155.ap-south-2.compute.amazonaws.com:3000/api",
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