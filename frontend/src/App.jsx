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
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from './redux/user/userActions.js';

const App = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const userReducer = new userActions(dispatch)

  const isAuthenticated = useSelector(state => state.user.isAuthenticated)
  const user = useSelector(state => state.user.user)

  useEffect(async () => {
    checkisAuthenticated()
  }, []);

  const checkisAuthenticated = async () => {
    try {
      const authData = await checkAuth()
      authData ? userReducer.setUser(authData.userId) : userReducer.logoutAccount()
    } catch (error) {
      console.error(error)
    }
  }
 

  useEffect(() => {
    if (isAuthenticated !== null) {
      const timer = setTimeout(() => setLoading(false), 1000); 
    }
  }, [isAuthenticated]);

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

      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute isAuth={isAuthenticated}>
              <Header />
              <Main />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<AuthForm />} />
      </Routes>
    </div>
  );
};

export default App;
