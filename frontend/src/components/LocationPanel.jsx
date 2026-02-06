import React, { useEffect, useState } from 'react'
import { IoLocation } from "react-icons/io5";
import axios from "axios";
const LocationPanel = ({vehiclePanel, setVehiclePanel, setUp, activeFocus, pickupSet, setPickupSet, destinationSet, setDestinationSet, setPickUp, setDestination, pickUp, destination, getAllFare}) => {
  const [suggestions, setSuggestions] = useState([]);
  
  useEffect(() => {
    const getAllSuggestions = async () => {
      try{
        let query = activeFocus === "pickup" ? pickUp : destination;
        if(query.length > 2){
          const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/maps/get-suggestions`, {params: { input: query }, withCredentials: true, 
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
          });
         setSuggestions(data.suggestions);

        }else{
          setSuggestions([]);
        }
      }catch(err){
        console.error(err);
      }
    };
    getAllSuggestions();
  }, [pickUp, destination, activeFocus]);
  
  useEffect(() => {
    if(pickUp && destination){
      if(destinationSet || pickupSet){
        getAllFare();
          setVehiclePanel(true); 
      setUp(false);
      }else{
          setVehiclePanel(false); 
      setUp(true);
      }
    }
  }, [destinationSet, pickupSet])
  const handleLocationPanel = (locValue) => {
     if(activeFocus === 'pickup'){
      setPickupSet(true);
      setDestinationSet(false);
      setPickUp(locValue);
      
     }else if(activeFocus === 'destination'){
      setDestinationSet(true);
      setPickupSet(false);
      setDestination(locValue);
     }
     setSuggestions([]);  
  }
  return (
   <div className="h-full overflow-y-scroll w-full">
    {suggestions.map((loc, idx) => {
      return (
         <div onClick={() => handleLocationPanel(loc.description)} className="px-6 border border-2 border-gray-200 rounded-lg active:border-black w-[90%] ml-5 mt-5" key={idx}>
      <div className="flex gap-2 items-center justify-start mt-5">
        <h1 className="bg-[#eee] h-8 w-8 rounded-full flex items-center justify-center"><IoLocation className="h-5 w-5"/></h1>
        <h4 className="text-[18px] font-medium">{loc.description}
        </h4>
      </div>
    </div>
      )
    })}

   </div>
  )
}

export default LocationPanel
