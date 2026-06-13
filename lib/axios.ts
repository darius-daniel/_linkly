import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/api/",
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});

export default axiosInstance;
