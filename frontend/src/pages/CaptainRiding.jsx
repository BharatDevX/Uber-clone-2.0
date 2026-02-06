import React, { useState, useRef } from "react";
import { useContext, useEffect } from "react";
import { RidingContext } from "../context/RidingContext";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import axios from "axios";

// --- SVG Icons --- //
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

const MessageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
);


// --- Main App Component --- //
export default function App() {
  const [isOnline, setIsOnline] = useState(true);
  const {rideState, setRideState, newRide, setNewRide} = useContext(RidingContext);
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [showTripPopup, setShowTripPopup] = useState(false);
  
  const bottomSheetControls = useAnimation();
  const constraintsRef = useRef(null);
 
   useEffect(() => {
    if (rideState === "accepted") {
      bottomSheetControls.start({ y: 0 }); // expand fully
    }
    if (rideState === "en-route") {
      bottomSheetControls.start({ y: 100 }); // keep slightly open but visible
    }
  }, [rideState, bottomSheetControls]);
 useEffect(() => {
    let interval;
    if (rideState === "en-route") {
      interval = setInterval(() => {
        setShowTripPopup(true);
        const timer = setTimeout(() => setShowTripPopup(false), 5000);
        return () => clearTimeout(timer);
      }, 30000); // every 30 sec
    }}, []);
    useEffect(() => {
      console.log(rideState);
    }, [rideState]);
  const handleStartRide = async () => {
  try {
    console.log("Starting ride with:", { rideId: newRide._id, otp });

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ride/start-ride`, {
      params: {
        rideId: newRide._id,
        otp: otp,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    console.log("✅ Response from backend:", response.data);

    if (response.data.success) {
      // ✅ Backend returned success
      setRideState("en-route");
      setNewRide(response.data.ride);
      
      console.log("🎉 Ride started successfully!");
    } else {
      // ❌ Backend returned failure
      alert(response.data.message || "Failed to start ride");
    }
  } catch (error) {
    console.error("❌ Error starting ride:", error);
    alert("Error starting ride. Please try again.");
  }
};

const handleEndRide = async() => {
  try{
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ride/end-ride`, {
      rideId: newRide._id,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    if(response.data.success){
    setRideState(null); 
  navigate("/captain-home"); 
  setNewRide(null);
    }

  }catch(err){
    console.error(err);
  }
}


  
  
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };


  return (
    <div className="relative h-screen w-full font-sans bg-black overflow-hidden flex flex-col justify-end">
       {/* Google Font */}
       <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
       </style>

      {/* --- Background Map --- */}
      <motion.div
        className="absolute inset-0 h-full w-full"
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <LocationTracking />
      </motion.div>

      {/* --- Main Content Overlay --- */}
      <motion.div 
        className="relative z-10 p-4 md:p-6 h-full flex flex-col"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        ref={constraintsRef}
      >
        
        {/* -- Top Section: Captain Profile -- */}
        

        {/* -- Center Section based on Ride State -- */}
        <div className="flex-grow flex flex-col items-center justify-center">
            {rideState === 'en-route' && showTripPopup && (
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                    <h2 className="text-gray-600 text-3xl font-bold">Trip to {newRide?.destination}</h2>
                    <p className="text-blue-400 text-xl">25 MIN</p>
                </motion.div>
            )}
        </div>


        {/* --- Bottom Sheet --- */}
        <motion.div
          className="bg-[#1C1C1E] rounded-t-3xl shadow-2xl absolute bottom-0 left-0 right-0"
          drag="y"
          dragConstraints={{ top: 0, bottom: 250 }}
          dragElastic={0.2}
          onDragEnd={(event, info) => {
            if (info.offset.y > 100) {
              bottomSheetControls.start({ y: 250 });
            } else {
              bottomSheetControls.start({ y: 0 });
            }
          }}
          animate={bottomSheetControls}
          initial={{ y: 250 }}
          transition={{ type: "spring", damping: 25, stiffness: 200}}
        >
          {/* Draggable Handle */}
          <div className="py-3 flex justify-center">
            <div className="w-12 h-1.5 bg-gray-600 rounded-full"></div>
          </div>
          
          {/* Content */}
          <div className="px-5 pb-5">
            {/* Passenger Info Card */}
            <div className="bg-[#2C2C2E]/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/women/44.jpg"
                alt="Passenger"
                className="w-14 h-14 rounded-full border-2 border-gray-500"
              />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">{newRide?.user.firstname + " " + newRide?.user.lastname}</h2>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <span className="font-bold text-yellow-400">★ 4.9</span>
                  <span>(25 rides)</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-white"><MessageIcon /></button>
                <button className="w-11 h-11 bg-gray-700 rounded-full flex items-center justify-center text-white"><PhoneIcon /></button>
              </div>
            </div>

            {/* Ride Details */}
            <div className="mt-4 text-white">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="w-0.5 h-10 bg-gray-600 my-1"></div>
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-1">
                    <p className="text-gray-400 text-sm">PICKUP</p>
                    <p className="font-semibold text-lg">{newRide?.pickup}</p>
                    <p className="text-gray-400 text-sm mt-4">DROP-OFF</p>
                    <p className="font-semibold text-lg">{newRide?.destination}</p>
                </div>
              </div>
            </div>

             {/* OTP & Action Button */}
             {rideState === "accepted" && (
                <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-center font-semibold text-gray-300 mb-2">Enter OTP to Start Ride</p>
                  <input
                    type="text"
                    maxLength="4"
                    placeholder="****"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center text-4xl font-bold tracking-[1em] p-3 border-2 border-gray-700 rounded-lg outline-none focus:border-blue-500 bg-black text-white mb-4"
                  />
                  <motion.button
                    onClick={handleStartRide}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-xl shadow-md text-lg transition-all flex items-center justify-center gap-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    START RIDE <ArrowRightIcon/>
                  </motion.button>
                </motion.div>
             )}
             {rideState === "en-route" && (
                <motion.div 
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.button
                    onClick={() => handleEndRide()}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-md text-lg transition-all"
                    whileTap={{ scale: 0.98 }}
                  >
                    END RIDE
                  </motion.button>
                </motion.div>
             )}

          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
