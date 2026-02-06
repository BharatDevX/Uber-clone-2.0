const rideService = require('../service/Ride.service');
const mapsService = require('../service/maps.service');
const { validationResult } = require('express-validator');
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../model/Ride.model");


exports.createRide = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // 1️⃣ Create ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        console.log("Ride created:", ride._id);

        // 2️⃣ Get coordinates
        const pickupCoordinates = await mapsService.getAddressCoordinate(pickup);
        if (!pickupCoordinates) {
            return res.status(400).json({ message: "Invalid pickup location" });
        }
        console.log("Pickup coordinates:", pickupCoordinates);

        // 3️⃣ Get nearby captains
        const captainInRadius = await mapsService.getCaptainInRadius(
            pickupCoordinates.ltd,
            pickupCoordinates.lng,
            2
        );
        console.log("Nearby captains:", captainInRadius);

        // 4️⃣ Prepare ride data for captain
        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user'); // populate lowercase 'user'
        rideWithUser.otp = ""; // clear sensitive info

        // 5️⃣ Broadcast to captains
        captainInRadius.forEach(captain => {
            if (captain.socketId) {
                sendMessageToSocketId(captain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                }); // emit directly
                console.log(`Ride sent to captain ${captain._id} at socket ${captain.socketId}`);
            }
        });

        // 6️⃣ Respond to user
        return res.status(201).json({
            ride,
            message: 'Ride is booked successfully and shared with nearby captains'
        });

    } catch (err) {
        console.error("Error creating ride:", err);
        return res.status(500).json({ message: err.message });
    }
};


exports.getFare = async (req, res) => {
     const error = validationResult(req);
     if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        });
     }
     const { pickup, destination} = req.query;
     try{
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json({fare});
     }catch(err){
        return res.status(500).json({
            message: err.message
        })
     }
}

exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;
  console.log("Incoming confirmRide body:", req.body);
  console.log("🟡 Incoming captain from token:", req.captain);

  try {
    const ride = await rideService.confirmRide({rideId, captain: req.captain });

    if (ride?.user?.socketId) {
      console.log("✅ Emitting ride-confirmed to user:", ride.user._id);
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: {ride},
      });
    } else {
      console.warn("⚠️ User socket not found for ride:", ride._id);
    }
    console.log("ride: ", ride);
    return res.status(200).json({
      success: true,
      ride,
      message: "Ride confirmed successfully",
    });
  } catch (err) {
    console.error("❌ confirmRide error:", err.message);
    return res.status(500).json({ message: err.message });
  }
};

exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain });

        console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: {ride}
        })

        return res.status(200).json({
            success: true,
            message: "Ride Started Successfully",
            ride
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}
exports.endRide = async(req, res) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array(),
        })
    }
    const { rideId } = req.body;
    try{
        const ride = await rideService.endRide({rideId, captain: req.captain});
        if(ride?.user?.socketId){
            sendMessageToSocketId(ride.user.socketId, {
                event: "ride-ended",
                data: ride,
            })
        }
        return res.status(200).json({
            success: true,
            ride,
            message: "Ride Ended Successfully"
        })

    }catch(err){
        return res.status(500).json({
            message: err.message
        })
    }
}