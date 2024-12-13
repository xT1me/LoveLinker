import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon, Instagram as InstagramIcon, Twitter as TwitterIcon, Facebook as FacebookIcon } from "@mui/icons-material";

const UpdateForm = ({
  onSubmit,
  title,
  buttonText,
  initialData = {},
  initialImage
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.keys(formData).some(
        (key) => formData[key] === "" || formData[key] === undefined
      )
    ) {
      setError("Please fill in all required fields.");
      return;
    }

      await onSubmit(formData);

  };


  const closeDialog = () => {
    setOpenModal(false);
  };

  return (
    <Box
      sx={{
        padding: 4,
        margin: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 3, textAlign: "center" }}>
        {title}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleInputChange}
              fullWidth
              variant="filled"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              fullWidth
              variant="filled"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Middle Name"
              name="middleName"
              value={formData.middleName || ""}
              onChange={handleInputChange}
              fullWidth
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              name="username"
              value={formData.username || ""}
              onChange={handleInputChange}
              fullWidth
              variant="filled"
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              fullWidth
              variant="filled"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Instagram URL"
              name="instagram"
              value={formData.instagram || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <InstagramIcon sx={{ marginRight: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Twitter URL"
              name="twitter"
              value={formData.twitter || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <TwitterIcon sx={{ marginRight: 1 }} />,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Facebook URL"
              name="facebook"
              value={formData.facebook || ""}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: <FacebookIcon sx={{ marginRight: 1 }} />,
              }}
            />
          </Grid>
        </Grid>

        {error && (
          <Typography color="error" sx={{ marginTop: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          sx={{
            marginTop: 4,
            backgroundColor: "#f9a825",
            color: "#fff",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#e55b45",
            },
          }}
          fullWidth
        >
          {buttonText}
        </Button>
      </form>

      <Dialog open={openModal} onClose={closeDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Form in Modal</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button variant="contained" onClick={closeDialog}>Close Modal</Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UpdateForm;
