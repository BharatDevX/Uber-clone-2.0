import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RidingContext } from "@/context/RidingContext";

const vehicleImages = [
  // Uber Car
  "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1554506931/navigation/UberXL.png",
  // Uber Bike
  "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1570826758/navigation/UberMoto.png",
  // Uber Auto
  "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1569461463/navigation/UberBlack.png",
];


// (you can replace this with a better 2D road PNG)

const FindingRide = ({pickup, destination}) => {
  const { isConfirming, setIsConfirming } = useContext(RidingContext);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Change vehicle every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % vehicleImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if(progress === 100){
      setIsConfirming(false);
    }
  }, [progress]);

  // Progress bar animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-2">Finding your Ride...</h3>

      {/* Animated vehicle on road */}
      <div className="relative w-52 h-32 flex flex-col items-center justify-end">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={vehicleImages[index]}
            alt="vehicle"
            className="w-40 h-50 object-contain relative z-10"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>

        {/* Road image */}
        
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md bg-gray-200 rounded-full h-3">
        <motion.div
          className="bg-green-600 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.2 }}
        />
      </div>

      {/* Status Text */}
      <p className="text-gray-600 mt-2">
        We are connecting you with nearby drivers...
      </p>
    </div>
  );
};

export default FindingRide;
