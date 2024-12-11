import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Modal,
} from "@mui/material";
import { Logout, Person, Settings } from "@mui/icons-material";
import AuthForm from "../AuthForm/AuthForm.jsx";
import { getUserPhoto, updateUser } from "../../api/users/users.js";
import UpdateForm from "../UpdateForm/UpdateForm.jsx";

const Header = ({
  isAuth,
  setAuth,
  setUserId,
  logoutAccount,
  setUser,
  user,
}) => {
  const [isAuthOpened, setIsAuthOpened] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "photoUrl", label: "Photo", type: "file", required: false },
  ];

  const toggleAuthModal = () => {
    setIsAuthOpened(!isAuthOpened);
  };

  const toggleSettingsModal = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (user.photoUrl) {
        const photo = await getUserPhoto(user.photoUrl);
        setPhoto(photo);
      }
    };
    fetchImage();
  }, [user]);

  const onAuthSuccess = (id, user) => {
    setAuth(true);
    toggleAuthModal();
    setUser(user);
    setUserId(id);
  };

  const handleFormSubmit = async (formData) => {
    console.log(formData)
    try {
      await updateUser(user._id, formData);
      setUser({ ...user, ...formData });
      toggleSettingsModal();
    } catch (err) {
      setError("Error with update data");
    }
  };

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
        {isAuthOpened && (
          <Modal open={isAuthOpened} onClose={toggleAuthModal}>
            <AuthForm onClose={toggleAuthModal} onAuthSuccess={onAuthSuccess} />
          </Modal>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {isAuth && (
            <>
              <Avatar
                src={photo || "assets/images/default-avatar.png"}
                alt={user.name}
                sx={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
              <Typography variant="body1" sx={{ color: "#333" }}>
                {user.name} {user.lastName}
              </Typography>
              <IconButton onClick={logoutAccount} color="#333">
                <Logout />
              </IconButton>
              <IconButton onClick={toggleSettingsModal} color="#333">
                <Settings />
              </IconButton>
            </>
          )}
          {!isAuth && (
            <IconButton onClick={toggleAuthModal} color="inherit">
              <Person />
            </IconButton>
          )}
        </div>
      </Toolbar>

      <Modal open={isSettingsOpen} onClose={toggleSettingsModal}>
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "30px",
            borderRadius: "8px",
            maxWidth: "600px",
            width: "100%",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h6">Settings</Typography>
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
        </div>
      </Modal>
    </AppBar>
  );
};

export default Header;
