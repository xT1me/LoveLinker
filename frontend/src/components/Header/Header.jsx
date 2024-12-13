import React, { useEffect, useState, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Modal,
  Box,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import { getUserPhoto, updateUser } from "../../api/users/users.js";
import UpdateForm from "../UpdateForm/UpdateForm.jsx";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/user/userActions.js";

const Header = () => {
  const [photo, setPhoto] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState("");

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const userReducer = new userActions(dispatch);

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "photoUrl", label: "Photo", type: "file", required: false },
  ];

  const toggleSettingsModal = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (user?.photoUrl) {
        try {
          const fetchedPhoto = await getUserPhoto(user.photoUrl);
          setPhoto(fetchedPhoto);
        } catch {
          setPhoto(null);
        }
      }
    };
    fetchImage();
  }, [user]);

  const handleFormSubmit = async (formData) => {
    try {
     await updateUser(user._id, formData);

     userReducer.setUser(user._id)
      toggleSettingsModal();
    } catch (err) {
      setError("Error updating profile");
    }
  };

  const logoutAccount = useCallback(() => {
    userReducer.logoutAccount();
  }, [userReducer]);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
          LoveLinker
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user && (
            <>
              <Avatar
                src={photo || "assets/images/default-avatar.png"}
                alt={user.name}
                sx={{ width: 45, height: 45 }}
              />
              <Typography variant="body1" sx={{ color: "#333" }}>
                {`${user.name} ${user.lastName}`}
              </Typography>
              <IconButton onClick={logoutAccount} sx={{ color: "#333" }}>
                <Logout />
              </IconButton>
              <IconButton onClick={toggleSettingsModal} sx={{ color: "#333" }}>
                <Settings />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      <Modal open={isSettingsOpen} onClose={toggleSettingsModal}>
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: 3,
            borderRadius: 1,
            maxWidth: 600,
            width: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Settings
          </Typography>
          <UpdateForm
            fields={fields}
            onSubmit={handleFormSubmit}
            title="Change profile"
            buttonText="Save"
            initialData={user}
            errorMessage={error}
            isRegistering={false}
            toggleForm={toggleSettingsModal}
            initialImage={photo}
          />
        </Box>
      </Modal>
    </AppBar>
  );
};

export default Header;
