import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from "./context/UserContext.jsx";
import CaptainProvider from './context/CaptainContext.jsx';
import RidingProvider from "./context/RidingContext.jsx";
import SocketProvider from "./context/SocketContext.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptainProvider>
    <AuthProvider>
      <RidingProvider>
        <SocketProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </SocketProvider>
    </RidingProvider>
    </AuthProvider>
    </CaptainProvider>
  </StrictMode>,
)
