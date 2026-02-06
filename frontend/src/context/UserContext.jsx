import axios from "axios";
import React, { useEffect, useState } from "react";
import { createContext } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const updateUser = (auth) => {
        setUser(auth);
    }
    const [token, setToken] = useState(null);
    
   
    const value = {
        user, 
        setUser,
        token,
        setToken,
        updateUser

    }
    return(
        <>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
        </>
    )
}

export default AuthProvider;