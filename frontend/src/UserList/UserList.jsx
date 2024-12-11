import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { getUserPhoto } from "../api/users/users";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const UserCard = ({ user, onMessageClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (user.photoUrl) {
        const photo = await getUserPhoto(user.photoUrl);
        setPhoto(photo);
      }
    };
    fetchImage();
  }, [user]);

  const renderSocialIcon = (Icon, link) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ margin: "0 8px", color: "inherit" }}
    >
      <Icon fontSize="large" />
    </a>
  );

  return (
    <>
      <Card
        sx={{
          width: 345,
          margin: "10px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          borderRadius: 3,
          overflow: "hidden",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 16px 0 16px",
          }}
        >
          <Avatar
            src={photo}
            alt={user.name}
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
        <CardContent sx={{ padding: "16px" }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              transition: "color 0.3s",
              "&:hover": {
                color: "#f9a825",
              },
            }}
          >
            {user.name} {user.middleName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {user.age} years, {user.sex === "male" ? "Male" : "Female"}
          </Typography>
          {user.description && (
            <Typography variant="body2" sx={{ marginBottom: "12px" }}>
              {user.description}
            </Typography>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "12px",
            }}
          >
            {user.instagram && renderSocialIcon(Instagram, user.instagram)}
            {user.twitter && renderSocialIcon(Twitter, user.twitter)}
            {user.facebook && renderSocialIcon(Facebook, user.facebook)}
          </div>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: "16px",
              backgroundColor: "#f9a825",
              "&:hover": {
                backgroundColor: "#e68900",
              },
              borderRadius: 25,
            }}
            onClick={() => onMessageClick(user._id)}
          >
            Chat
          </Button>
        </CardContent>
      </Card>

      {isOpen && (
        <Lightbox
          mainSrc={photo || "assets/images/default-avatar.png"}
          onCloseRequest={() => setIsOpen(false)}
          imageTitle={`${user.name} ${user.lastName}`}
        />
      )}
    </>
  );
};

const UserList = ({ users, openChat }) => {
  const handleMessageClick = (user) => {
    openChat(user);
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: "64px" }}>
      {users.map((user) => (
        <Grid
          item
          key={user._id}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <UserCard user={user} onMessageClick={handleMessageClick} />
        </Grid>
      ))}
    </Grid>
  );
};

export default UserList;
