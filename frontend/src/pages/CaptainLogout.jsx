import React, { useContext } from 'react'
import { CaptainContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";

const CaptainLogout = () => {
  const { logout, captain, setCaptain} = useContext(CaptainContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/captain-login');
  }
  return (
    <div>
      <button onClick={() => handleLogout()}><FiLogOut className="w-10 h-7"/></button>
    </div>
  )
}

export default CaptainLogout
