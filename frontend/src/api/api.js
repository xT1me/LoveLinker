import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:3003";

const getToken = () => Cookies.get("accessTokenDev");
const getRefreshToken = () => Cookies.get("refreshTokenDev");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
      const token = getToken();

  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      const refreshTokenDev = getRefreshToken();
  
      if (token && isTokenExpired(token) && refreshTokenDev) {
        try {
          const refreshedTokens = await refreshTokenFunction(refreshTokenDev);
  
          config.headers.Authorization = `Bearer ${refreshedTokens.accessTokenDev}`;
        } catch (error) {
          console.error("Token refresh failed", error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

const isTokenExpired = (token) => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  return Date.now() >= payload.exp * 1000;
};

const refreshTokenFunction = async (refreshTokenDev) => {
  const response = await api.post("/auth/refresh", { refreshTokenDev });
  return response.data;
};

export default api;
