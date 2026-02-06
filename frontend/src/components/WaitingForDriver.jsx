import React, {useEffect, useContext} from "react";
import { motion } from "framer-motion";
import { MapPin, CircleDollarSign, Star } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { RidingContext } from "@/context/RidingContext";
const WaitingForRider = ({ setWaitingDriverPanel, setConfirmRidePanel, setVehiclePanel, selectVehicle }) => {
  const { newRide, setNewRide, acceptedRide, setAcceptedRide } = useContext(RidingContext);
    const handleCancelRide = (e) => {
      
      setWaitingDriverPanel(false);
    setConfirmRidePanel(false);
    setVehiclePanel(false);
    setAcceptedRide(null);
    }
    
  return (
    <div className="w-full bg-gray-100">
    
      {/* Bottom Card */}
      <motion.div
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
       className="bg-white rounded-t-3xl shadow-lg p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <span className="text-black-600 text-xl font-semibold">Waiting for your Driver…</span>
          <p className="text-gray-500 text-sm">Your driver is on the way. Sit tight!</p>
        </div>

        {/* Driver Info */}
        <div className="flex items-center justify-between">
          {/* Profile + Car */}
          <div className="flex items-center space-x-4">
            <div className="relative right-2">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="driver"
                className="w-14 h-14 rounded-full border-2 border-green-500 relative top-6 z-10"
              />
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.LDdjV5baIP0xaHPjrJaA9AHaE6?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="car"
                className="relative bottom-9 left-5 rounded-full w-20 h-15 opacity-90"
              />
            </div>

            <div className="ml-2">
              <h2 className="font-semibold text-gray-800">{acceptedRide?.captain?.firstname + " " + acceptedRide?.captain?.lastname}</h2>
              <div className="flex items-center text-md text-gray-600 font-semibold">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span>4.9 · 1,243 rides</span>
              </div>
              <h3 className="text-md text-gray-600 font-bold">
                {selectVehicle === "car" ? <span>White Swift Dzire</span>:(selectVehicle === "motorcycle")?<span>Bajaj splendor</span>:(selectVehicle === "auto" ? <span>Bajaj Auto</span>:"")} <br />
                {acceptedRide?.captain?.vehicle.plate}
              </h3>
            </div>
          </div>

          {/* Arrival Info */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-right"
          >
            <p className="text-green-500 font-semibold">PIN: {acceptedRide?.otp}</p>
            <p className="text-sm text-gray-500">Arrival 7:44 PM</p>
          </motion.div>
        </div>

        <hr className="my-4" />

        {/* Pickup & Drop */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <FaMapMarkerAlt className="w-5 h-5 text-black-500 mt-1" />
            <p className="text-md text-gray-800 font-semibold">
              {acceptedRide?.pickup}
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <RiCheckboxBlankFill className="w-5 h-5 text-black-500 mt-1" />
            <p className="text-md text-gray-800 font-semibold">{acceptedRide?.destination}</p>
          </div>
        </div>

        <hr className="my-4" />

        {/* Fare */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold">{Math.floor(acceptedRide?.fare)}</span>
          </div>
          <span className="text-sm text-gray-500">UPI / BHIM-UPI</span>
        </div>

        {/* Cancel Button */}
        
        <button
          onClick={() => handleCancelRide()}
          className="mt-5 w-full py-3 bg-red-500 text-white rounded-xl font-semibold shadow-md active:bg-red-600 transition"
        >
          Cancel Ride
        </button>
      </motion.div>
      
    </div>
  );
};

export default WaitingForRider;
