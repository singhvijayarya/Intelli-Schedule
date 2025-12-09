// src/lib/api.ts
import axios from "axios";
import { getAccessToken, saveAccessToken, clearAccessToken } from "@/utils/token";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // always include cookies (session or httpOnly tokens)
  headers: {
    "Content-Type": "application/json"
  }
});

// attach access token from storage (if present)
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor to handle 401 and refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (val?: any) => void; reject: (err: any) => void; config: any }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else {
      if (token && prom.config.headers) prom.config.headers.Authorization = "Bearer " + token;
      prom.resolve(prom.config);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config;
    if (!originalConfig || originalConfig.__isRetry) return Promise.reject(err);

    // If 401, try refresh flow
    if (err.response?.status === 401) {
      if (isRefreshing) {
        // queue the request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalConfig });
        }).then((cfg) => axios(cfg));
      }

      isRefreshing = true;
      try {
        // Try to refresh token. Backend must implement /user/refresh or similar.
        // This call should work when refresh token is in httpOnly cookie.
        const refreshResp = await axios.post(
          "http://localhost:8000/api/v1/user/refresh-token",
          {},
          { withCredentials: true }
        );
        // If backend also returns new accessToken in body, save it.
        const newAccessToken = refreshResp?.data?.data?.accessToken ?? refreshResp?.data?.accessToken ?? null;
        if (newAccessToken) saveAccessToken(newAccessToken);

        processQueue(null, newAccessToken);
        originalConfig.__isRetry = true;
        if (originalConfig.headers && newAccessToken) {
          originalConfig.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axios(originalConfig);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAccessToken(); // clear local token
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
