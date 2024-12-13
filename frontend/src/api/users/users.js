import api from "../api";

export const getUsersList = async (id) => {
  try {
    const response = await api.get(`/users/list/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};


export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error.response ? error.response.data : error.message;
  }
};

export const getUserPhoto = async (path) => {
  try {
      const response = await api.get(`/uploads/${path}`, {
          responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
  } catch (error) {
      console.error('Error fetching file:', error);
      throw error;
  }
};

export const updateUser = async (id, updatedData) => {
  try {
    const response = await api.put(`/users/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error during user update:", error);
    throw error;
  }
};

export const uploadUserAvatar = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await api.post(`/users/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

