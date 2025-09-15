// src/axios.js
import axios from "axios";

const BASE_URL =  "http://127.0.0.1:8000/api/";


const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("JWT attached to request:", config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
