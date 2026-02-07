import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "production" ? "/api" : "http://localhost:5000",
    withCredentials: true,
});

export default axiosInstance;