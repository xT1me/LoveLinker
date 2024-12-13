import React, { useEffect, useState } from "react";
import { login, register } from "../../api/auth/auth";
import Form from "../../ui/Form/Form.jsx";
import { uploadUserAvatar } from "../../api/users/users.js";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../redux/user/userActions.js";
import { useNavigate } from "react-router";

const loginFields = [
  { name: "username", label: "Username", type: "text", required: true },
  { name: "password", label: "Password", type: "password", required: true },
];

const registerFields = [
  { name: "photo", label: "Photo", type: "file" },
  { name: "lastName", label: "Last Name", type: "text", required: true },
  { name: "name", label: "Name", type: "text", required: true },
  { name: "middleName", label: "Middle Name", type: "text" },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "description", label: "Description", type: "text" },
  { name: "age", label: "Age", type: "number", required: true },
  { name: "sex", label: "Sex", type: "text", required: true },
  ...loginFields,
  { name: "confirmPassword", label: "Confirm Password", type: "password", required: true },
];

const AuthForm = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user)
  const userReducer = new userActions(dispatch);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsRegistering(prevState => !prevState);
    setError("");
  };

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  const handleSubmit = async (formData) => {
    try {
      setError("");

      if (isRegistering) {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        await handleRegister(formData);
      }

      await handleLogin(formData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  const handleRegister = async (formData) => {
    const { lastName, name, middleName, email, description, age, sex, username, password, photo } = formData;

    if (photo) {
      await uploadUserAvatar(photo);
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
      photoUrl: photo?.name,
    });
  };

  const handleLogin = async (formData) => {
    const loginData = await login(formData.username, formData.password);
    userReducer.setUser(loginData.userId);
  };

  return (
    <div className="auth-container">
      <Form
        fields={isRegistering ? registerFields : loginFields}
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
