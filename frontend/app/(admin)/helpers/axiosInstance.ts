import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

export default axiosInstance;
