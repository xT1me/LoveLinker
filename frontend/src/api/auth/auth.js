import api from "../api";

export const getToken = () => localStorage.getItem("token");

const setToken = (token) => localStorage.setItem("token", token);

const removeToken = () => localStorage.removeItem("token");

export const register = async (data) => {
  try {
    const response = await api.post("/users/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/users/login", { username, password });
    const { access_token } = response.data;

    setToken(access_token);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await api.get("/auth/check", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error during authentication check:", error);
    throw error;
  }
};

export const logout = () => {
  removeToken();
};
