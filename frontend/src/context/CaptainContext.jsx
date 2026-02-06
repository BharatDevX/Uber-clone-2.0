import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const CaptainContext = createContext();

const CaptainProvider = ({ children }) => {
  const [captain, setCaptain] = useState(null);

  // Load captain from localStorage token on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios
        .get("/captain/profile")
        .then((res) => {
          if (res.data.success) {
            setCaptain(res.data.captain);
          }
        })
        .catch((err) => {
          console.error("Profile fetch error:", err.response?.data);
          
          delete axios.defaults.headers.common["Authorization"];//authorization is deleted beacause when you logged in user it was storing token in memory header but here you again doing same so 401 error is coming so delete the prior once and store again new one
        });
    }
  }, []); // ✅ only once on mount

  const updateCaptain = (cap) => setCaptain(cap);

  const register = async (credentials) => {
    try {
      const { data } = await axios.post("/captain/register", credentials);
      if (data.success) {
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await axios.post("/captain/login", credentials);
      if (data.success) {
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        console.log("Token saved:", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Login error:", err.response?.data);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/captain/logout", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCaptain(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.error("Logout error:", err?.message);
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const value = {
    captain,
    setCaptain,
    updateCaptain,
    register,
    login,
    logout,
  };

  return (
    <CaptainContext.Provider value={value}>
      {children}
    </CaptainContext.Provider>
  );
};

export default CaptainProvider;
export const useCaptain = () => useContext(CaptainContext);
