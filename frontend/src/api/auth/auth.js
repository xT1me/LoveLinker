import api from "../api";

export const register = async (data) => {
  try {
    const response = await api.post("/users/register", data);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });

    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get("/auth/check");
    return response.data;
  } catch (error) {
    console.error("Error during authentication check:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error.response ? error.response.data : error.message;
  }
};