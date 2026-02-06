import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AuthContext } from '../context/UserContext';

const UserProtectedWrapper = ({ children }) => {
  const {token, setToken, user, setUser} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);

    if (!storedToken) {
      toast.error("Please login"); 
      navigate('/login'); 
    }
     axios
  .get(`${import.meta.env.VITE_BACKEND_URL}/users/profile`, {
    headers: {
      Authorization: `Bearer ${storedToken}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      setUser(response.data.user);
    }
  })
  .catch((err) => {
    console.error("Profile fetch error:", err.response?.data || err.message);
    localStorage.removeItem("token");
    navigate("/login");
  })
  }, []);

  

  if (token === null) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
};

export default UserProtectedWrapper;
