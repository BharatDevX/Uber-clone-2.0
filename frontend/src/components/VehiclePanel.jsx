  import React, { useEffect, useState } from 'react'
  import { GoPersonFill } from "react-icons/go";
  import axios from "axios";
  const VehiclePanel = ({setVehiclePanel, vehicleRef, setConfirmRidePanel, pickUp, destination, setSelectVehicle, setVehicle, fare, setFare, selectVehicle}) => {
    
    
      const vehicles = [
      {
        id: 1,
        vehicleType: "car",
        name: "UberGo",
        img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1554506931/navigation/UberXL.png",
        persons: 4,
        time: "2 mins away",
        desc: "Affordable, compact rides",
        price: `₹${Math.floor(fare.car)}`,
      },
      {
        id: 2,
        vehicleType: "sedan",
        name: "UberXL",
        img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1569461463/navigation/UberBlack.png",
        persons: 6,
        time: "3 mins away",
        desc: "Spacious rides for groups",
        price: "₹450",
      },
      {
        id: 3,
        vehicleType: "auto",
        name: "UberAuto",
        img: "https://tse4.mm.bing.net/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
        persons: 3,
        time: "1 min away",
        desc: "Affordable auto rides",
        price: `₹${Math.floor(fare.auto)}`,
      },
      {
        id: 4,
        vehicleType: "motorcycle",
        name: "UberMoto",
        img: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco/v1570826758/navigation/UberMoto.png",
        persons: 1,
        time: "1 min away",
        desc: "Quick bike rides",
        price: `₹${Math.floor(fare.motorcycle)}`,
      },
    ];
    
    
      
      
    
    return (
        <div
          ref={vehicleRef}
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white p-3 rounded-t-2xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-2">Choose a ride</h3>
          <div className="flex flex-col gap-3">
            {vehicles.map((v) => (
              <div
              onClick={() => {setVehiclePanel(false); setConfirmRidePanel(true); setVehicle(v.img); setSelectVehicle(v.vehicleType)}}  
                key={v.id}
                className="border border-gray-200 active:border-black active:shadow-md rounded-xl flex gap-3 items-center justify-between p-3 cursor-pointer transition-all duration-300"
              >
                <img src={v.img} className="h-14" alt={v.name} />
                <div className="ml-2 flex-1">
                  <h4 className="flex items-center font-medium text-lg">
                    {v.name}
                    <GoPersonFill className="ml-2 text-gray-600" />
                    <span className="ml-1 text-sm">{v.persons}</span>
                  </h4>
                  <h5 className="text-sm text-gray-600">{v.time}</h5>
                  <p className="text-sm text-gray-400">{v.desc}</p>
                </div>
                <h2 className="font-bold text-lg">{v.price}</h2>
              </div>
            ))}
          </div>
        </div>

    )
  }

  export default VehiclePanel
