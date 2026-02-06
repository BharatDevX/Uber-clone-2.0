import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RidingContext } from "../context/RidingContext";
import { CaptainContext } from "../context/CaptainContext";
import { Switch } from "@headlessui/react";
import { SocketContext } from "../context/SocketContext"; 
import {
  FaCar,
  FaUserCircle,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaCheck,
  FaTimes,
  FaPhone,
  FaComments,
  FaMapMarkerAlt,
  FaLocationArrow,
  FaRupeeSign, // Added for earnings
  FaStar,       // Added for rating
  FaCheckCircle, // Added for success
  FaTimesCircle, // Added for rejected
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import LocationTracking from "@/components/LoactionTracting";

const CaptainHome = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { socket } = useContext(SocketContext);
  const { rideState, setRideState, newRide, setNewRide } = useContext(RidingContext);
  const [rideRequests, setRideRequests] = useState([]); // Initially empty to show stats
  const { captain } = useContext(CaptainContext);
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  // MOCK DATA: In a real app, this would come from an API
  const [dailyStats, setDailyStats] = useState({
    earnings: 2450,
    totalTrips: 12,
    rating: 4.8,
    successful: 8,
    rejected: 4,
  });
  
  const [selectedRide, setSelectedRide] = useState(null);
  const [timer, setTimer] = useState(30);


  useEffect(() => {
    if(captain){
      socket.emit('join', {
        userType: "captain",
        userId: captain._id
      })
  
}
  }, [captain]) 
  useEffect(() => {
    const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                  const lng = position.coords.longitude;
                  const ltd = position.coords.latitude;
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
            type: "Point",
            coordinates: [
                Number(lng), // lng
                Number(ltd)   // lat
            ]
        }
                    })
                })
            }
        }
        
        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation();
  }, [socket]);

 useEffect(() => {
  if (!socket) return;

  const handleNewRide = (data) => {
    console.log("🚕 New Ride received:", data);
    setNewRide(data);
    setRideState("incoming");
  };

  // Remove any existing listener before adding
  socket.off("new-ride", handleNewRide);
  socket.on("new-ride", handleNewRide);

  // Cleanup on unmount
  return () => {
    socket.off("new-ride", handleNewRide);
  };
}, [socket]);

   
  async function confirmRide() {
    console.log("Confirming ride with:", { rideId: newRide?._id, captainId: captain?._id });

  try {

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/ride/confirm-ride`,
      { rideId: newRide._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("✅ Ride confirmed:", response.data);
    setNewRide(response.data.ride);
    setRideState("accepted");
  } catch (err) {
    console.error("🚨 Axios error in confirmRide:", err);
  }
}


  // This useEffect can be used to simulate an incoming ride request after some time
  
  useEffect(() => {
  if (newRide && isOnline) {
    console.log(newRide);
    setRideRequests([newRide]);
  } else {
    setRideRequests([]);
  }
}, [isOnline, newRide]);


  // Timer for ride request expiration
  useEffect(() => {
  if (rideRequests?.length > 0) {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          handleReject(rideRequests[0].id);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }
}, [rideRequests]);

  const handleAccept = (_id) => {
    
    const ride = rideRequests.find((r) => r._id === _id);
    setSelectedRide(ride);
    setRideRequests([]); // Clear all other requests
  };
 
  const handleReject = (id) => {
    setRideRequests((prev) => prev.filter((req) => req.id !== id));
  };

  const pageVariants = {
    initial: { opacity: 0, y: "50px" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "-50px" },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-800">
      {/* Map Background */}
      <LocationTracking />

      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-30">
        <div
          className="p-2 bg-white rounded-full shadow-lg cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <FaUserCircle className="text-gray-800 text-3xl" />
        </div>

        <div className="flex items-center gap-3 bg-white rounded-full p-2 shadow-lg">
          <span className={`font-bold text-sm ${isOnline ? "text-green-600" : "text-gray-500"}`}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
          <Switch
            checked={isOnline}
            onChange={setIsOnline}
            className={`${
              isOnline ? "bg-green-600" : "bg-gray-300"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
          >
            <span
              className={`${
                isOnline ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-10">
                <FaUserCircle className="text-gray-700 text-5xl" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{captain.firstname + " " + captain.lastname}</h2>
                  <p className="text-sm text-gray-500">4.9 ★</p>
                </div>
              </div>
              <nav className="flex-1 space-y-2">
                <button className="flex items-center gap-4 text-lg text-gray-700 w-full p-3 rounded-lg hover:bg-gray-100 transition">
                  <FaHistory /> Ride History
                </button>
                <button className="flex items-center gap-4 text-lg text-gray-700 w-full p-3 rounded-lg hover:bg-gray-100 transition">
                  <FaCar /> Vehicle
                </button>
                <button className="flex items-center gap-4 text-lg text-gray-700 w-full p-3 rounded-lg hover:bg-gray-100 transition">
                  <FaCog /> Settings
                </button>
              </nav>
              <div className="mt-auto">
                 <button className="flex items-center gap-4 text-lg text-red-500 w-full p-3 rounded-lg hover:bg-red-50 transition">
                    <FaSignOutAlt /> Logout
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {!selectedRide ? (
          <motion.div
            key="home"
            className="absolute bottom-0 left-0 w-full z-20 flex flex-col items-center p-4"
          >
            {!rideRequests || rideRequests?.length === 0 ? (
              // === NEW: TODAY'S ACTIVITY CARD ===
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="bg-white w-screen fixed translate-y-[-420px] max-w-lg rounded-t-2xl shadow-2xl p-6 text-gray-800"
              >
                <h2 className="text-xl font-bold mb-1">Today's Activity</h2>
                <p className="text-sm text-gray-500 mb-4">{currentDate.toLocaleDateString('en-US', options)}</p>
                
                {/* Earnings */}
                <div className="bg-green-50 text-green-800 p-4 rounded-xl mb-4">
                    <p className="text-sm font-semibold">Today's Earnings</p>
                    <p className="text-3xl font-bold">₹{dailyStats.earnings.toLocaleString('en-IN')}</p>
                </div>
                
                {/* Other Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <FaCar className="text-blue-500 text-2xl mb-2"/>
                        <p className="text-sm font-semibold">Total Trips</p>
                        <p className="text-2xl font-bold">{dailyStats.totalTrips}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <FaStar className="text-yellow-500 text-2xl mb-2"/>
                        <p className="text-sm font-semibold">Rating</p>
                        <p className="text-2xl font-bold">{dailyStats.rating}</p>
                    </div>
                     <div className="bg-gray-100 p-4 rounded-xl">
                        <FaCheckCircle className="text-green-500 text-2xl mb-2"/>
                        <p className="text-sm font-semibold">Successful</p>
                        <p className="text-2xl font-bold">{dailyStats.successful}</p>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl">
                        <FaTimesCircle className="text-red-500 text-2xl mb-2"/>
                        <p className="text-sm font-semibold">Rejected</p>
                        <p className="text-2xl font-bold">{dailyStats.rejected}</p>
                    </div>
                </div>

              </motion.div>
            ) : (
              // RIDE REQUEST CARD
              rideRequests?.map((ride) => (
                <motion.div
                  key={ride.id}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="bg-gray-900 text-white w-full max-w-lg rounded-t-2xl shadow-2xl p-6 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-green-400">{Math.floor(ride.fare)} RS</h2>
                      <p className="text-gray-400">2.2 away</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold">{timer}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">pickup</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="space-y-4 text-gray-200">
                    <div className="flex items-start gap-3">
                        <FaLocationArrow className="text-blue-400 mt-1"/>
                        <div>
                            <p className="font-semibold text-white">{ride?.pickup}</p>
                            <p className="text-xs text-gray-400">Pickup Location</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-green-400 mt-1"/>
                        <div>
                            <p className="font-semibold text-white">{ride?.destination}</p>
                            <p className="text-xs text-gray-400">Destination</p>
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => handleReject(ride.userId)}
                      className="flex-1 flex items-center justify-center p-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition"
                    >
                      <FaTimes />
                    </button>
                    <button
                      onClick={() => handleAccept(ride._id)}
                      className="flex-[3] flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
                    >
                      <FaCheck /> ACCEPT
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          // RIDE DETAIL PAGE (Full Screen)
          <motion.div
            key="rideDetail"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 z-30 bg-gray-50 flex flex-col"
          >
            {/* Map Placeholder */}
            <div className="w-full h-1/2 bg-gray-300 flex items-center justify-center text-gray-500">
                Map View to Pickup
            </div>

            {/* Content Section */}
            <div className="p-6 bg-white rounded-t-2xl -mt-4 shadow-2xl flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-gray-500 text-5xl" />
                    <div>
                      <h3 className="text-xl font-bold">{selectedRide?.user.firstname} {selectedRide?.user.lastname}</h3>
                      <p className="text-sm text-gray-500">2.2 km away</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-green-600 transition"><FaPhone /></button>
                    <button className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl hover:bg-blue-600 transition"><FaComments /></button>
                  </div>
                </div>

                 <div className="space-y-3 my-4 text-gray-700">
                    <p><span className="font-semibold">Pickup:</span> {selectedRide?.pickup}</p>
                    <p><span className="font-semibold">Dropoff:</span> {selectedRide?.destination}</p>
                 </div>
                 
                 {selectedRide.notes &&
                    <p className="text-sm bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4">
                        <strong>Note:</strong> {!selectedRide.notes && "Notes"}
                    </p>
                 }
                
                <div className="mt-auto">
                    <button
                        onClick={() => setSelectedRide(null)}
                        className="w-full text-center text-red-500 font-semibold py-3 mb-4 rounded-lg hover:bg-red-50 transition"
                     >
                        Cancel Ride
                    </button>
                    <Link
                      to="/captain-riding"
                      className="w-full block text-center bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition"
                      onClick={() => {setRideState("accepted"); confirmRide();}}
                    >
                      SLIDE TO ARRIVE
                    </Link> 
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaptainHome;