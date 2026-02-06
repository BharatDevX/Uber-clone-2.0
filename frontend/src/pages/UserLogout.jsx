import React, { useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/UserContext";

const UserLogout = () => {
  const navigate = useNavigate();
    const {user, setUser} = useContext(AuthContext);

 const logout = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔑 get stored token
        await axios.get("http://localhost:4000/users/logout", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token in header
          },
          withCredentials: true, // if backend uses cookies
        });

        localStorage.removeItem("token"); // 🔑 clear token
        setUser(null);
        toast.success("Logged out successfully!");
        
      } catch (error) {
        console.error(error);
        toast.error("Logout failed! Please login again.");
        
      }
    };

   
  

  return <div>
    <button onClick={() => {logout(); navigate('/login')}}>Logout</button>
  </div>;
};

export default UserLogout;
