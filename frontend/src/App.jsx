import { useState, useContext, useEffect } from 'react'
import { Router, BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Home from "./pages/Home";
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/CaptainLogin'
import CaptainSignup from './pages/CaptainSignup'
import { Toaster } from 'react-hot-toast';
import UserProtectedWrapper from './pages/UserProtectedWrapper';
import { AuthContext } from './context/UserContext';
import UserLogout from './pages/UserLogout';
import CaptainLogout from './pages/CaptainLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import { RidingContext } from './context/RidingContext';

function App() {
  const {user} = useContext(AuthContext);
  const { rideState } = useContext(RidingContext);

  return (
    <>
      <div>
        <Toaster />
       <Routes>
        <Route path="/" element={<Start />}/>
        <Route path="/login" element={!user?<UserLogin />:<Navigate to="/home"/>}/>
        <Route path="/signup" element={<UserSignup />}/>
        <Route path="/captain-login" element={<CaptainLogin />}/>
        <Route path="/captain-signup" element={<CaptainSignup />}/>
        <Route path="/home" element={
          <UserProtectedWrapper>
            {user ? <Home /> : <Navigate to="/login" />}
          </UserProtectedWrapper>
        }/>
        <Route path="/user/riding" element={
          <UserProtectedWrapper>
            {<Riding />}
          </UserProtectedWrapper>
        }/>
          <Route path="/user/logout" element={<UserProtectedWrapper >
            <UserLogout />
          </UserProtectedWrapper>}/> 
          <Route path="/captain-home" element={
            <CaptainProtectWrapper>
              <CaptainHome/>
            </CaptainProtectWrapper>
          }/>
          <Route path="/captain/logout" element={<CaptainProtectWrapper>
            <CaptainLogout />
          </CaptainProtectWrapper>}/>
          <Route path="/captain-riding" element={
            <CaptainProtectWrapper>
              {rideState==='accepted' || rideState==='en-route'?<CaptainRiding />:<Navigate to="/captain-home"/>}
            </CaptainProtectWrapper>
          }/>
       </Routes>
      </div>
    </>
  )
}

export default App
