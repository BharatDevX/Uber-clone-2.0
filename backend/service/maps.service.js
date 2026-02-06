const axios = require('axios');
const captainModel = require('../model/captain.model');

require('dotenv').config();

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    try {
        const response = await axios.get(url); 
        const data = response.data;             
        
        if(data.status === "OK") {             
            const location = data.results[0].geometry.location;
            return {                           
                ltd: location.lat,             
                lng: location.lng             
            };
        }
        throw new Error('Location not found'); // Added error handling for no results
    } catch(err) {
        console.error('Error fetching coordinates:', err);
        throw err;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if(!origin || !destination){
         throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;  
    try{
        const response = await axios.get(url);
        if(response.data.status === "OK"){
            if(response.data.rows[0].elements[0].status === "ZERO RESULTS"){
                throw new Error('No routes found');
        }
        return response.data.rows[0].elements[0];
    }else{
        throw new Error('Error to fetch distanec and time');

    }
    }catch(err){
        console.error(err);
        throw err;
    }
}

module.exports.getSuggestions = async (input) => {
    if(!input){
        throw new Error('address is required');
    }
    const apiKey = process.env.GOOGLE_MAP_API;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    try{
        const response = await axios.get(url);
        if(response.data.status === "OK"){
            return response.data.predictions;
        }else{
            throw new Error('Error to fetch suggestions');
        }
    }catch(err){
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainInRadius = async (lat, lng, radius) => {
  const earthRadiusKm = 6371;

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[Number(lng), Number(lat)], radius / earthRadiusKm]
      }
    }
  });

 
  return captains;
};
