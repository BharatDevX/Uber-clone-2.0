import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { CaptainContext } from "../context/CaptainContext";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { login, captain } = useContext(CaptainContext);
  // Refs for animation targets
  const emailSection = useRef(null);
  const passwordSection = useRef(null);
  const buttonSection = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const captainData = {
      email: email,
      password: password,
    }
    login(captainData);
  
  };

  useEffect(() => {
    if(captain){
      console.log(captain);
      navigate('/captain-home');
    }
  }, [captain, navigate]);
  useEffect(() => {
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
      );
  }, []);
  
  return (
    <div className="p-4 h-screen flex flex-col justify-between bg-white overflow-hidden">
      <div>
        <img
          src="https://th.bing.com/th/id/R.ee430489d1505483166c19ab9ed00d4e?rik=TR8JYzS1MJsqxg&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f4%2fUber-Logo-PNG-Free-Image.png&ehk=RkArudRupF3ki6m0KJJ67MImDo65xcs3upha4JAEOME%3d&risl=&pid=ImgRaw&r=0"
          alt="uber"
          className="w-20 h-12 pt-5 ml-7 mb-4"
        />

        <form className="p-7" onSubmit={(e) => handleLoginSubmit(e)}>
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
              className="font-mono px-4 py-2 mb-2 rounded-lg w-full bg-[#eeee]"
            />
          </div>

          <div ref={buttonSection}>
            <button
              type="submit"
              className="px-2 py-2 bg-[#111] text-white font-semibold mt-5 w-full font-mono text-xl rounded-lg hover:bg-[#222] transition-all duration-300"
            >
              Login
            </button>
            <p className="text-center mt-1">
              Join new fleet?
              <Link to="/captain-signup" className="text-blue-600 hover:underline">
                Register as Captain
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="px-7" ref={buttonSection}>
        <Link
          to="/login"
          className="flex items-center justify-center px-2 py-2 bg-[#10b461] text-white font-semibold mt-5 w-full font-mono text-xl rounded-lg hover:bg-[#0e9a53] transition-all duration-300"
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
