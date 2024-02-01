import axios from "axios";
import { getSession } from "next-auth/react";
import { SERVER_URL } from "@/backendUrl";

const customFetch = () => {
  const axiosInstance = axios.create({
    baseURL: SERVER_URL,
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
