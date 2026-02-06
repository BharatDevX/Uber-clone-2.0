import React, { useState, useContext } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { MdPayments } from "react-icons/md";
import FindingRide from "./FindingRide";
import { IoMdArrowBack } from "react-icons/io";
import { RidingContext } from "@/context/RidingContext";
const ConfirmRide = ({ pickUp, destination, setUp, setVehiclePanel, setConfirmRidePanel, rides, vehicle, setRides, createRide, selectVehicle, fare }) => {
  
 const { isConfirming, setIsConfirming  } = useContext(RidingContext);
  const handleConfirm = () => {
    // when user clicks confirm, show FindingRide screen
    createRide();
    setIsConfirming(true);
   
  };
  const handleDiv = (e) => {
    setVehiclePanel(false);
  }


  function splitAddress(address){
     const parts = address.split(",").map(p => p.trim());
  if (parts.length <= 2) {
    return { main: address, secondary: "" };
  }
  const main = parts.slice(0, parts.length - 2).join(", ");
  const secondary = parts.slice(parts.length - 2).join(", ");
  return { main, secondary };
  }

  if (isConfirming) {
    return <FindingRide pickUp={pickUp} destination={destination} rides={rides}/>;
  }
     const add1 = splitAddress(pickUp);
     const add2 = splitAddress(destination);
  return (
    <div onClick={(e) => handleDiv(e)}>
      {/* Header */}
      <div className="w-full flex flex-row justify-between p-1 px-2">
        <h3 className="font-bold" onClick={() => setConfirmRidePanel(false)}><IoMdArrowBack className="font-bold text-[25px]"/></h3>
        <h3 className="text-lg font-semibold mb-2">Confirm your Ride</h3>
      </div>

      <div className="flex flex-col justify-between items-center gap-2">
        {/* Car image */}
        <img
          src={vehicle}
          alt="car"
          className="h-28"
        />

        <hr className="w-screen text-gray-400 mt-3 mb-3 rounded-lg" />

        {/* Ride details */}
        <div className="w-full flex flex-col">
          {/* Pickup */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="h-15 mr-2" />
            <div className="px-3">
              <h3 className="font-bold">{add1.main}</h3>
              <p className="text-same text-gray-600 mt-1">
                {add1.secondary}
              </p>
            </div>
          </div>

          <hr className="w-[95%] ml-1 text-gray-400 mt-3 mb-3 rounded-lg" />

          {/* Destination */}
          <div className="flex items-center">
            <RiCheckboxBlankFill className="h-15 mr-2" />
            <div className="px-3">
              <h3 className="font-bold">{add2.main}</h3>
              <p className="text-same text-gray-600 mt-1">
                {add2.secondary}
              </p>
            </div>
          </div>

          <hr className="w-[95%] ml-1 text-gray-400 mt-3 mb-3 rounded-lg" />

          {/* Payment */}
          <div className="flex items-center">
            <MdPayments className="h-15 mr-2" />
            <div className="px-3">
              <h3 className="font-bold">₹{Math.floor(fare[selectVehicle])}</h3>
              <p className="text-same text-gray-600 mt-1">upi/Bhim-upi</p>
            </div>
          </div>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide;
