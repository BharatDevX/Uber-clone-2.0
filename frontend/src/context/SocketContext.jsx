import React from 'react';
import { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

 const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
const SocketProvider = ({children}) => {
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        })
    }, []);
    
    const value = {
        socket
    }
    return(
        <>
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
        </>
    )
}
export default SocketProvider;