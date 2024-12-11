import React, { useState } from "react";
import { login, register } from "../../api/auth/auth";
import Form from "../../ui/Form/Form.jsx";
import { uploadUserAvatar } from "../../api/users/users.js";

const AuthForm = ({ onAuthSuccess, onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const fieldsForLogin = [
    { name: "username", label: "Username", type: "text", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const fieldsForRegister = [
    { name: "photo", label: "Photo", type: "file" },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "name", label: "Name", type: "text", required: true },
    { name: "middleName", label: "Middle Name", type: "text" },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "description", label: "Description", type: "text" },
    { name: "age", label: "Age", type: "number", required: true },
    { name: "sex", label: "Sex", type: "text", required: true },
    ...fieldsForLogin,
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      required: true,
    },
  ];

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError("");
  };


  const handleSubmit = async (formData) => {

      setError("");

      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        const {
          lastName,
          name,
          middleName,
          email,
          description,
          age,
          sex,
          username,
          password,
          photo
        } = formData;

        if (photo) {
          await uploadUserAvatar(photo)
        }

        await register({
          lastName,
          name,
          middleName,
          email,
          description,
          age,
          sex,
          username,
          password,
          photoUrl: photo && photo.name
        });
        const user = await login(formData.username, formData.password);

        onAuthSuccess(user.userData._id, user.userData);
      } else {
        const user = await login(formData.username, formData.password);

        onAuthSuccess(user.userData._id, user.userData);
      }

  };

  return (
    <div className="auth-container">
      <Form
        fields={isRegistering ? fieldsForRegister : fieldsForLogin}
        onSubmit={handleSubmit}
        isRegistering={isRegistering}
        title={isRegistering ? "Register" : "Login"}
        buttonText={isRegistering ? "Register" : "Login"}
        onClose={onClose}
        errorMessage={error && <p className="error-message">{error}</p>}
        toggleForm={toggleForm}
      />
    </div>
  );
};

export default AuthForm;
