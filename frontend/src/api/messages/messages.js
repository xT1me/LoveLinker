import api from "../api";

export const getToken = () => localStorage.getItem("token");


export const getChat = async (user1Id, user2Id) => {
  try {
    const response = await api.post(`/messages/chat/`, {
        user1Id,
        user2Id
      });
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const markAsRead = async (messageId) => {
    try {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error set read:", error);
      throw error;
    }
};

export const sendMessage = async (content) => {
    try {
      const response = await api.post(`/messages/`, content);
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };
  
