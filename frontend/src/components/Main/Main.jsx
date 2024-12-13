import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat.jsx";
import { getUsersList } from "../../api/users/users.js";
import UserList from "../../UserList/UserList.jsx";
import { Modal, Box, IconButton, Typography, Grid } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Main = () => {
  const user = useSelector(state => state.user.user);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenChat, setOpenChat] = useState(false);

  useEffect(async () => {
    if (user._id) {
      const users = await getUsersList(user._id);
      setUsers(users);
    }
  }, [user]);

  const handleOpenChat = (id) => {
    setSelectedUser(id);
    setOpenChat(true);
  };

  const closeChat = () => {
    setOpenChat(false);
    setSelectedUser(null);
  };

  return (
    <div className="main-container">
      {users.length === 0 ? (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh", textAlign: "center" }}
        >
          <Typography
            variant="h5"
            color="textSecondary"
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            No users found
          </Typography>
        </Grid>
      ) : (
        <UserList users={users} openChat={handleOpenChat} />
      )}

      <Modal open={isOpenChat} onClose={closeChat}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            p: 2,
            width: "70%",
            minHeight: "40%",
            maxHeight: "100%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <IconButton
            onClick={closeChat}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.primary",
            }}
          >
            <Close />
          </IconButton>
          <Chat user2Id={selectedUser} close={closeChat} />
        </Box>
      </Modal>
    </div>
  );
};

export default Main;
