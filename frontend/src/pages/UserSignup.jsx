import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import gsap from "gsap";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "../context/UserContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;
const UserSignup = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const {user, setUser} = useContext(AuthContext);
  const navigate = useNavigate();

  const emailSection = useRef(null);
  const passwordSection = useRef(null);
  const buttonSection = useRef(null);
  const name = useRef(null);
  const firstName = useRef(null);
  const lastName = useRef(null);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      firstname: first,
      lastname: last,
      email: email,
      password: password,
    };
    
    const response = await axios.post('/users/register', newUser);//you can also do const { data } = await axios.post('/users/login', newUser)
    if(response.data.success){
      updateUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      toast.success(response.data.message);
      navigate('/home');
    }else{
      toast.error(response.data.message);
    }
    

    setFirst("");
    setLast("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if(firstName.current){
      firstName.current.focus();
    }
    // GSAP animation timeline
    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });

    tl.fromTo(
      emailSection.current,
      { x: -100, opacity: 0 },
      { x: 0, opacity: 1 }
    )
      .fromTo(
        passwordSection.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1 },
        "-=0.5"
      )
      .fromTo(
        buttonSection.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.6"
      )
      .fromTo(
        name.current,
        { y: -100, opacity: 0},
        { y: 0, opacity: 1},
        "-=0.8"
      )
      .fromTo(
        firstName.current,
        { x: -100, opacity: 0},
        { x: 0, opacity: 1},
        "-=0.9"
      )
      .fromTo(
        lastName.current, 
        { x: 100, opacity: 0},
        { x: 0, opacity: 1},
        "-=0.9"
      );

  }, []);

  return (
    <div> 
      <div className="p-4 h-screen flex flex-col justify-between bg-white overflow-hidden">
      <div>
        <img
          src="https://th.bing.com/th/id/R.ee430489d1505483166c19ab9ed00d4e?rik=TR8JYzS1MJsqxg&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f4%2fUber-Logo-PNG-Free-Image.png&ehk=RkArudRupF3ki6m0KJJ67MImDo65xcs3upha4JAEOME%3d&risl=&pid=ImgRaw&r=0"
          alt="uber"
          className="w-20 h-12 pt-5 ml-7 mb-4"
        />

        <form className="p-7" onSubmit={(e) => handleSignupSubmit(e)}>
          <h3 ref={name} className="text-xl font-medium mb-2 font-serif">What's your name?</h3>
          <div className="flex gap-2">
           <input 
           value={first}
           onChange={(e) => setFirst(e.target.value)}
           ref={firstName} type="text" required placeholder="First name" className="bg-[#eeee] w-1/2 mb-7 rounded-lg px-4 py-2 font-mono w-full text-lg placeholder:text-base"/>
           <input 
           value={last}
           onChange={(e) => setLast(e.target.value)}
           ref={lastName} type="text" required placeholder="Last name" className="bg-[#eeee] w-1/2 mb-7 rounded-lg px-4 py-2 font-mono w-full text-lg placeholder:text-base"/>
          </div>
          <div ref={emailSection}>
            <h3 className="text-xl font-medium mb-2 font-serif">
              What's your email ?
            </h3>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="bg-[#eeee] mb-7 rounded-lg px-4 py-2 font-mono w-full text-lg placeholder:text-base"
            />
          </div>

          <div ref={passwordSection}>
            <h3 className="font-serif mb-2 font-medium">Enter password</h3>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="font-mono px-4 py-2 mb-2  rounded-lg w-full bg-[#eeee]"
            />
          </div>

          <div ref={buttonSection}>
            <button 
              type="submit"
              className="px-2 py-2 bg-[#111] text-white font-semibold mt-5 w-full font-mono text-xl rounded-lg hover:bg-[#222] transition-all duration-300"
            >
              Register
            </button>
            <p className="text-center mt-1">
              Already have a account?
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
      <p className="leading-tight text-sm">By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, including by automated means, from Uber and its affiliates to the number provided.</p>
    </div>
    </div>
  )
}

export default UserSignup
