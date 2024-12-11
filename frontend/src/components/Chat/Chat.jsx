import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { getChat, markAsRead, sendMessage } from "../../api/messages/messages";

const Chat = ({ user1Id, user2Id, close }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await sendMessage({
        senderId: user1Id,
        receiverId: user2Id,
        content: newMessage,
      });
      setNewMessage("");
      await updateMessages();
    }
  };

  const updateMessages = async () => {
    const chatMessages = await getChat(user1Id, user2Id);
    setMessages(chatMessages);
  };

  useEffect(() => {
    updateMessages();
    const interval = setInterval(updateMessages, 750);
    return () => clearInterval(interval);
  }, [user1Id, user2Id]);

  const markMessagesAsRead = async () => {
    const unreadMessages = messages.filter(
      (msg) => !msg.isRead && msg.receiverId === user1Id
    );
    await Promise.all(unreadMessages.map((msg) => markAsRead(msg._id)));
  };

  useEffect(() => {
    markMessagesAsRead();
  }, [messages]);

  return (
    <>
      <Typography variant="h5" textAlign="center" gutterBottom sx={{ color: "#333" }}>
        Chat
      </Typography>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: "400px",
          margin: "20px 0",
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {messages.map((message) => (
          <Paper
            key={message._id}
            sx={{
              p: 1.5,
              my: 1,
              maxWidth: "75%",
              alignSelf:
                message.senderId === user1Id ? "flex-end" : "flex-start",
              bgcolor:
                message.senderId === user1Id ? "#FFA500" : "#E0E0E0",
              color: "black",
              borderRadius:
                message.senderId === user1Id
                  ? "16px 16px 0px 16px"
                  : "16px 16px 16px 0px",
              boxShadow: 2,
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "right",
                mt: 0.5,
                color: "rgba(0, 0, 0, 0.6)",
                fontWeight: 900,
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              {message.isRead ? "✓✓" : "✓"}
            </Typography>
          </Paper>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
          alignItems: "center",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 20,
              backgroundColor: "#f5f5f5",
            },
            mr: 2,
            input: {
              padding: "10px",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{
            borderRadius: 20,
            px: 4,
            alignSelf: "flex-end",
            backgroundColor: "#f9a825",
            "&:hover": {
              backgroundColor: "#e68900",
            },
          }}
        >
          Send
        </Button>
      </Box>
    </>
  );
};

export default Chat;
