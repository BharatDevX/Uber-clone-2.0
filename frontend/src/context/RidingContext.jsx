import React from 'react';
import { createContext, useState } from 'react';

export const RidingContext = createContext();

const RidingProvider = ({children}) => {
    const [newRide, setNewRide] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [acceptedRide, setAcceptedRide] = useState(null);
    const [rideState, setRideState] = useState(null); // "incoming", "accepted", "en-route"
    const value = {
        rideState,
        setRideState,
        isConfirming,
        setIsConfirming,
        newRide,
    setNewRide  ,
    acceptedRide,
    setAcceptedRide,
    }
    return(
        <>
        <RidingContext.Provider value={value}>{children}</RidingContext.Provider>
        </>
    )
}
export default RidingProvider;