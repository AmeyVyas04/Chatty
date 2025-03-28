import axios from "axios";

export const axiosinstance = axios.create({
    baseURL: "http://localhost:5050/api",
    withCredentials: true, // ✅ Ensures cookies are sent (if needed)
    headers: {
        "Content-Type": "application/json",
    },
});

// ✅ Automatically attach token to every request
axiosinstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
