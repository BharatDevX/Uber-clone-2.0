import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CaptainContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
  const { captain, setCaptain } = useContext(CaptainContext);
  const navigate = useNavigate();
  const storedToken = localStorage.getItem('token');
  const [loading, setLoading] = useState(true); // 👈 to handle profile fetching

  useEffect(() => {
    if (!storedToken) {
      navigate('/captain-login'); 
      return;
    }

    // ✅ Only run once inside useEffect
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/captain/profile`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    }).then((response) => {
      if (response.status === 200) {
        setCaptain(response.data.captain);
      }
    }).catch(err => {
      
      navigate('/captain-login');
    }).finally(() => {
      setLoading(false);
    });
  }, [navigate, setCaptain, storedToken]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
