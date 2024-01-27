import axios from "axios";
import { getSession } from "next-auth/react";

const customFetch = () => {
  const baseUrl = "https://code-collab-server-qeff.onrender.com";
  // const baseUrl = "http://localhost:8080";
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      "content-type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const data = await getSession();
    const token = data?.user?.express_token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  return axiosInstance;
};

export default customFetch();
