import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Link,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

const Form = ({
  fields,
  onSubmit,
  title,
  buttonText,
  initialData = {},
  errorMessage,
  isRegistering,
  toggleForm,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: file,
    }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fields.some((field) => field.required && !formData[field.name])) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 800,
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
          {fields.map((field) => (
            <Grid
              item
              xs={12}
              sm={field.type === "file" ? 12 : 6}
              key={field.name}
            >
              {field.type === "file" ? (
                <FormControl fullWidth>
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                      border: "2px solid #ccc",
                      cursor: "pointer",
                    }}
                  >
                    <label
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <CloudUploadIcon sx={{ fontSize: 40, color: "#888" }} />
                      )}
                      <input
                        type="file"
                        name={field.name}
                        hidden
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          opacity: 0,
                          cursor: "pointer",
                        }}
                      />
                    </label>
                  </Box>
                </FormControl>
              ) : field.type === "text" && field.name === "sex" ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    value={formData[field.name] || ""}
                    name={field.name}
                    onChange={handleInputChange}
                    variant="filled"
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleInputChange}
                  required={field.required}
                  variant="filled"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            </Grid>
          ))}
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
      <Box sx={{ textAlign: "center", marginTop: 3 }}>
        <Typography variant="body2">
          {isRegistering
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <Link
            onClick={toggleForm}
            sx={{
              cursor: "pointer",
              color: "#f9a825",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "none",
                fontWeight: "bold",
              },
            }}
          >
            {isRegistering ? "Login" : "Register"}
          </Link>
        </Typography>
      </Box>

      {errorMessage && (
        <Typography color="error" sx={{ marginTop: 2, textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default Form;
