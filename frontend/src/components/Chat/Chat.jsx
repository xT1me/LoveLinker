import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getChat, markAsRead } from "../../api/messages/messages";
import CheckIcon from "@mui/icons-material/Check"; 

const Chat = ({ user2Id }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3003");

    socketRef.current.emit("joinChat", { user1Id: user._id, user2Id });

    socketRef.current.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToUnreadMessage();
    });

    socketRef.current.on("messageRead", (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("newMessage");
        socketRef.current.off("messageRead");
        socketRef.current.disconnect();
      }
    };
  }, [user._id, user2Id]);

  useEffect(() => {
    updateMessages();
    scrollToUnreadMessage();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            const message = messages.find((msg) => msg._id === messageId);
            if (message && !message.isRead && message.senderId !== user._id) {
              handleMarkAsRead(messageId);
            }
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    messageRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socketRef.current.emit("sendMessage", {
        senderId: user._id,
        receiverId: user2Id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  const updateMessages = async () => {
    const chatMessages = await getChat(user._id, user2Id);
    setMessages(chatMessages);
  };

  const scrollToUnreadMessage = () => {
    const firstUnreadMessage = messages.find((msg) => !msg.isRead);

    if (firstUnreadMessage) {
      const index = messages.findIndex((msg) => msg._id === firstUnreadMessage._id);
      messageRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
      socketRef.current.emit("markMessageAsRead", messageId);
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  return (
    <>
      <Typography variant="h5" textAlign="center" gutterBottom>
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((message, index) => (
          <Paper
            key={message._id}
            ref={(el) => (messageRefs.current[index] = el)}
            data-message-id={message._id}
            sx={{
              p: 1.5,
              my: 1,
              maxWidth: "75%",
              alignSelf:
                message.senderId === user._id ? "flex-end" : "flex-start",
              bgcolor:
                message.senderId === user._id ? "#FFA500" : "#E0E0E0",
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {message.isRead ? (
                <CheckIcon color="primary" />
              ) : (
                <CheckIcon color="disabled" />
              )}
            </Box>
          </Paper>
        ))}
        <div ref={messagesEndRef} />
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
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
    </>
  );
};

export default Chat;
