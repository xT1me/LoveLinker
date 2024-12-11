import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './App.css';
import Header from './components/Header/Header.jsx';
import Main from './components/Main/Main.jsx';
import AuthForm from './components/AuthForm/AuthForm.jsx';
import { checkAuth, logout } from './api/auth/auth.js';
import PrivateRoute from './routes/PrivateRoute.jsx';

const App = () => {
  const [isAuth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null)

  const navigate = useNavigate();

  const checkIsAuth = async () => {
    try {
      const userData = await checkAuth();
      if (userData) {
        setUserId(userData.id);
        setAuth(true);
        setUser(userData.user)
      } else {
        logoutAccount();
      }
    } catch (error) {
      console.error(error);
      setAuth(false)
    }
  };

  const logoutAccount = () => {
    logout();
    setAuth(false);
    setUser(null);
    setUserId(null);
  };

  useEffect(() => {
    checkIsAuth();
  }, []);

  useEffect(() => {
    if (isAuth !== null) {
      const timer = setTimeout(() => setLoading(false), 1000); 
    }
  }, [isAuth]);

  const onAuthSuccess = async (id, user) => {
    setAuth(true);
    setUserId(id);

    setUser(user)

    navigate('/');
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="App">
      {isAuth && user && (
        <Header
          isAuth={isAuth}
          setAuth={setAuth}
          setUserId={setUserId}
          logoutAccount={logoutAccount}
          setUser={setUser}
          user={user}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuth={isAuth}>
              <Main userId={userId} />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<AuthForm onAuthSuccess={onAuthSuccess} />} />
      </Routes>
    </div>
  );
};

export default App;
