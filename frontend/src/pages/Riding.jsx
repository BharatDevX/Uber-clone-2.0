import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleDollarSign,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RiCheckboxBlankFill } from "react-icons/ri";
import { TbHomeFilled } from "react-icons/tb";
import { RidingContext } from "../context/RidingContext";
import { SocketContext } from "@/context/SocketContext";

const RidingPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const constraintsRef = useRef(null);
  const navigate = useNavigate();
  const {acceptedRide, setAcceptedRide, rideState} = useContext(RidingContext);
  const { socket } = useContext(SocketContext);
   
  useEffect(() => {
  if (!socket) return;

  const handleRideEnd = () => {
    navigate("/home");
  };

  socket.on('ride-ended', handleRideEnd);

  return () => socket.off('ride-ended', handleRideEnd);
}, [socket, navigate]);
  // keep drag bounds updated with screen resize
  useEffect(() => {
    const handleResize = () => {
      if (constraintsRef.current) {
        constraintsRef.current.style.width = `${window.innerWidth}px`;
        constraintsRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
useEffect(() => {
      console.log(rideState);
    }, [rideState])
  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col justify-between relative overflow-hidden">
      
      {/* Invisible constraints for drag area */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none" />

      {/* Background Map */}
      <LocationTracking />

      {/* Top Trip Status */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="p-5 bg-white shadow-md flex justify-between items-center absolute top-0 z-10 w-full"
      >
        <div>
          <h1 className="text-lg font-semibold text-gray-800">On Trip</h1>
          <p className="text-sm text-gray-500">Heading to your destination</p>
        </div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-green-600 font-bold"
        >
          12 min
        </motion.div>
      </motion.div>

      {/* AnimatePresence handles toggle between card & bubble */}
      <AnimatePresence>
        {isOpen ? (
          // Full Trip Details Card
          <motion.div
            key="card"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
            className="fixed w-full z-10 bottom-0 bg-white p-3 rounded-t-2xl shadow-lg"
          >
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
                    className="relative bottom-9 left-5 w-20 h-15 opacity-90"
                  />
                </div>
                <div className="ml-5">
                  <h2 className="font-semibold text-gray-800">{acceptedRide?.captain.firstname + " " + acceptedRide?.captain.lastname}</h2>
                  <div className="flex items-center text-sm text-gray-600 font-semibold">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>4.9 · 1,243 rides</span>
                  </div>
                  <h3 className="text-md text-gray-600 font-bold">
                    White Swift Dzire <br /> {acceptedRide?.captain.vehicle.plate}
                  </h3>
                </div>
              </div>

              {/* Call / Chat */}
              <div className="flex space-x-3">
                <button className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200">
                  <Phone className="w-5 h-5 text-gray-700" />
                </button>
                <button className="p-2 bg-gray-100 rounded-full shadow hover:bg-gray-200">
                  <MessageSquare className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            <hr className="my-4" />

            {/* Pickup & Drop */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-black-600 mt-1" />
                <p className="text-md text-gray-800 font-semibold">
                  {acceptedRide?.destination}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <RiCheckboxBlankFill className="w-5 h-5 text-black-500 mt-1" />
                <p className="text-md text-gray-800 font-semibold">
                  {acceptedRide?.pickup}
                </p>
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

            {/* End Ride Button */}
            <button className="mt-5 w-full py-3 bg-green-600 text-white rounded-xl font-semibold shadow-md active:bg-green-900 transition">
              Make a Payment
            </button>
          </motion.div>
        ) : (
          // Floating Bubble (Draggable)
          <motion.div
            key="bubble"
            drag
            dragMomentum={false}
            dragElastic={0.2}
            dragConstraints={constraintsRef}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute bottom-6 right-6 w-16 h-16 rounded-full bg-white shadow-lg cursor-pointer flex items-center justify-center"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative flex items-center justify-center">
              {/* Driver Pic */}
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="driver"
                className="w-10 h-10 rounded-full border-2 border-green-500 z-10 relative"
              />
              {/* Car Pic (behind, 80% visible) */}
              <img
                src="https://tse1.mm.bing.net/th/id/OIP.LDdjV5baIP0xaHPjrJaA9AHaE6?cb=ucfimgc2&rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="car"
                className="absolute w-14 h-10 opacity-90 left-3 z-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RidingPage;
