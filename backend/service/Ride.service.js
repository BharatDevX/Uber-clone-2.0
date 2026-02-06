const { default: axios } = require('axios');
const Ride = require('../model/Ride.model');
const mapsService = require('./maps.service');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendMessageToSocketId } = require('../socket');
async function getFare(pickup, destination){
    if(!pickup || !destination){
        throw new Error('Pickup and destination are required');
    }
    const distanceTime = await mapsService.getDistanceTime(pickup, destination);
    const { distance, duration } = distanceTime;

    // Example fare calculation logic
    const baseFares = {
        auto: 30,
        motorcycle: 20,
        car: 50
    };
    const perKmRates = {
        auto: 9,
        motorcycle: 7,
        car: 15
    };
    const perMinRates = {
        auto: 2,
        motorcycle: 1,
        car: 3
    };

    const fares = {};
    for (const type of Object.keys(baseFares)) {
        fares[type] =
            baseFares[type] +
            perKmRates[type] * (distance.value / 1000) +
            perMinRates[type] * (duration.value / 60);
    }

    return fares;
}

module.exports.getFare = getFare;

function getOtp(num){
    function generateOtp(num){
        const otp = crypto.randomInt(Math.pow(10, num-1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async ({user, pickup, destination, vehicleType}) => {
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error('All fields are required');
    }
    const fare = await getFare(pickup, destination);
    const rides = new Ride({
        user,
        pickup,
        destination,
         otp: getOtp(4),
        fare: fare[vehicleType],  
       
    })
await rides.save();
return rides;
}

module.exports.confirmRide = async({rideId, captain}) => {
    if(!rideId){
        throw new Error('rideId and userId are required');
    }
    await Ride.findOneAndUpdate(
        {
            _id: rideId,

        },
        {
            status: "accepted",
            captain: captain._id
        }
    )
    const ride = await Ride.findOne({
        _id: rideId,
    }).populate("user").populate("captain").select("+otp");
    ride.status = "accepted";
    await ride.save();
    return ride;

}
module.exports.startRide = async({rideId, otp, captain}) => {
if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }
    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: "ongoing"
    })

    const ride = await Ride.findOne({
        _id: rideId
    }).populate("user").populate("captain").select("+otp");

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not accepted');
    }

    if (String(ride.otp) !== String(otp)) {
        throw new Error('Invalid OTP');
    }

    

    return ride;

}
module.exports.endRide = async({rideId, captain}) => {

    if(!rideId){
        throw new Error('rideId is requireed');
    }
     await Ride.findOneAndUpdate({
        _id: rideId,
    }, {
        status: "completed",
    })
    const ride = await Ride.findOne({_id: rideId, captain: captain._id}).populate("user").populate("captain")
    if(!ride){
        throw new Error ("Ride not found");
    }
    if(ride.status!=='completed'){
        throw new Error('Ride not started yet');
    }
   
    return ride;          
}