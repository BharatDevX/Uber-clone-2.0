  import React, { useContext, useEffect, useRef, useState } from "react";
  import { AuthContext } from "../context/UserContext";
  import { useGSAP } from "@gsap/react";
  import gsap from "gsap";
  import LocationPanel from "../components/LocationPanel";
  import { GoPersonFill } from "react-icons/go";
  import VehiclePanel from "../components/VehiclePanel";
  import ConfirmRide from "../components/ConfirmRide";
  import WaitingForDriver from "../components/WaitingForDriver";
  import axios from "axios";
  import { Socket } from "socket.io-client";
  import { io } from "socket.io-client";
  import { SocketContext } from "../context/SocketContext";
  import { RidingContext } from "../context/RidingContext";
  import { useNavigate } from "react-router-dom";
import LocationTracking from "@/components/LoactionTracting";
  const Home = () => {
    const navigate = useNavigate();
    const [authUser, setAuthUser] = useState({});
    const { socket } = useContext(SocketContext);
    const { isConfirming, setIsConfirming } = useContext(RidingContext);
    const { acceptedRide, setAcceptedRide, rideState, setRideState } = useContext(RidingContext);
    const [up, setUp] = useState(false);
    const [pickUp, setPickUp] = useState("");
    const [destination, setDestination] = useState("");
    const[pickupSet, setPickupSet] = useState(false);
    const [destinationSet, setDestinationSet] = useState(false);
    const [activeFocus, setActiveFocus] = useState(null);
    const [vehicle, setVehicle] = useState("https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1554506931/navigation/UberXL.png");
    const [fare, setFare] = useState({});
    
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [selectVehicle, setSelectVehicle] = useState(null);
    const [rides, setRides] = useState({});
    const vehicleRef = useRef(null);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [waitingDriverPanel, setWaitingDriverPanel] = useState(false);

  const confirmRideRef = useRef(null);
  const waitingDriver = useRef(null);
    const { user } = useContext(AuthContext);
    useEffect(() => {
    if(user){
      setAuthUser(user);
    }
    }, [user]);
    useEffect(() => {
      if (user && user._id) {
      
      socket.emit('join', { userType: "user", userId: authUser._id })
      console.log("Socket joined as user:", authUser._id);
    }
    }, [user, socket])
  useEffect(() => {
    if (!socket) return;

    const handleRideConfirmed = (data) => {
      console.log("🎉 Ride confirmed event received:", data);

      // ✅ handle both possible payload structures
      const rideData = data.ride ? data.ride : data;

      if (rideData && rideData.status === "accepted") {
        console.log("✅ Valid ride data received. Switching UI...");
        setAcceptedRide(rideData);
        setWaitingDriverPanel(true);
        setConfirmRidePanel(false);
        setVehiclePanel(false);
        setIsConfirming(false);
      } else {
        console.warn("⚠️ Ride-confirmed event received but no valid 'accepted' status:", rideData);
      }
    };

    socket.on("ride-confirmed", handleRideConfirmed);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);



    useEffect(() => {
    if (!socket) return;

    const handleStartRide = (payload) => {
      console.log("🚀 Ride-started event received:", payload);

      const rideData = payload?.ride; // always nested inside 'data.ride'

      if (rideData) {
        console.log("Ride status received:", rideData.status);
      }

      console.log(rideData);
      if (rideData && rideData.status === "ongoing") {
        console.log("✅ Ride is ongoing, redirecting to /user/riding...");
        setAcceptedRide(rideData);
        setWaitingDriverPanel(false);
        setRideState("en-route"); // track it in context
        navigate("/user/riding");
      } else {
        console.warn("⚠️ ride-started received but invalid data:", rideData);
      }
    };

    socket.on("ride-started", handleStartRide);

    return () => {
      socket.off("ride-started", handleStartRide);
    };
  }, [socket, navigate, setAcceptedRide, setWaitingDriverPanel, setRideState]);

    
    const handleUP = (e) => {
      if (e.key === "Enter") {
        setUp(false);
        setVehiclePanel(false); // show vehicles when pressing Enter
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setUp(false);
      setVehiclePanel(true); // show vehicles when submitting destination
    };
    const getAllFare = async() => {
          try{
              if (!pickUp || pickUp.length < 3 || !destination || destination.length < 3) {
            return; // don't call API if input is too short
          }
          const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ride/get-fare`, {
            params: { pickup: pickUp, destination: destination},
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          setFare(data.fare);
        }catch(err){
          console.error(err);
        }
        }

    const createRide = async() => {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ride/create-ride`, {
        pickup: pickUp,
        destination: destination,
        vehicleType: selectVehicle,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      console.log(data.ride);
      setRides(data.ride);

    }

    useGSAP(() => {
      gsap.to(vehicleRef.current, {
        y: vehiclePanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power3.out",
        
      });
    }, [vehiclePanel]);
    useGSAP(() => {
      gsap.to(confirmRideRef.current, {
        y: confirmRidePanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power3.out",
      });
    }, [confirmRidePanel]);
    useGSAP(() => {
      gsap.to(waitingDriver.current, {
        y: waitingDriverPanel ? "0%" : "100%",
        duration: 0.4,
        ease: "power3.out",
        
      });
    }, [waitingDriverPanel]);


    // 🚖 Vehicles Data
    

    return (
      <div>
        {/* Uber Logo */}
        <img
          src="https://th.bing.com/th/id/R.ee430489d1505483166c19ab9ed00d4e?rik=TR8JYzS1MJsqxg&riu=http%3a%2f%2fwww.pngall.com%2fwp-content%2fuploads%2f4%2fUber-Logo-PNG-Free-Image.png&ehk=RkArudRupF3ki6m0KJJ67MImDo65xcs3upha4JAEOME%3d&risl=&pid=ImgRaw&r=0"
          alt="uber"
          className="w-20 h-8 absolute left-5 top-10" 
        />

        {/* Background */}
        <div className="w-screen h-screen">
          <LocationTracking />
        </div>

        {/* Bottom Panel */}
        <div
          className={`bg-white absolute ${
            up ? "top-0" : "bottom-0"
          } ${up ? "h-screen" : "h-[25%]"} w-full flex flex-col justify-start`}
          
          onKeyDown={handleUP}
        >
          <div onClick={() => setUp(true)} className="h-[22%] p-5 bg-white relative">
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="line absolute h-20 w-1 top-20 left-10 bg-gray-900 rounded-full"></div>
              <input
                value={pickUp}
                onChange={(e) => setPickUp(e.target.value)}
                onFocus={() => setActiveFocus("pickup")}

                required
                type="text"
                placeholder="Add a pick-up location"
                className="bg-[#eeee] px-12 py-2 text-base rounded-lg w-full mt-3"
                onClick={() => setVehiclePanel(false)}
              />
              <br />
              <input
                value={destination}
                required
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setActiveFocus("destination")}
                type="text"
                placeholder="Add a destination location"
                className="bg-[#eeee] px-12 py-2 text-base rounded-lg w-full"
                // 👈 show vehicles when clicking destination
              />
            </form>
          </div>
          <div className={`h-[77%] ${!up && "hidden"} w-[96%] ml-2`}>
            <LocationPanel
              vehiclePanel={vehiclePanel}
              setVehiclePanel={setVehiclePanel}
              setUp={setUp}
              activeFocus={activeFocus}
              pickupSet={pickupSet}
              destinationSet={destinationSet}
              setPickupSet={setPickupSet}
              setDestinationSet={setDestinationSet}
              pickUp={pickUp}
              destination={destination}
              setPickUp={setPickUp}
              setDestination={setDestination}
              getAllFare={getAllFare}
            />
          </div>
        </div>
        {/* Vehicle Panel */}
      <VehiclePanel setVehiclePanel={setVehiclePanel} vehicleRef={vehicleRef} setConfirmRidePanel={
  setConfirmRidePanel
      } pickUp={pickUp} destination={destination} setSelectVehicle={setSelectVehicle} selectVehicle={selectVehicle} setVehicle={setVehicle} fare={fare} setFare={setFare} getAllFare={getAllFare}/>
      <div
          ref={confirmRideRef}
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 rounded-t-2xl shadow-lg"
        >
          <ConfirmRide pickUp={pickUp} destination={destination} setVehiclePanel={setVehiclePanel} setUp={setUp} setConfirmRidePanel={setConfirmRidePanel} rides={rides} setRides={setRides} vehicle={vehicle} createRide={createRide} selectVehicle={selectVehicle} fare={fare}/>
        </div>
        <div
        ref={waitingDriver}
          className="fixed w-full z-10 bottom-0  bg-white p-3 translate-y-full rounded-t-2xl shadow-lg"
        >
          <WaitingForDriver setWaitingDriverPanel={setWaitingDriverPanel} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} acceptedRide={acceptedRide} selectVehicle={selectVehicle} setAcceptedRide={setAcceptedRide}/>
        </div>
      </div>
    );
  };

  export default Home;
