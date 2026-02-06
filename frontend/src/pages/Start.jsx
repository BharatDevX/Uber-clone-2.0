import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className="bg-top bg-cover bg-[url(https://thumbs.dreamstime.com/b/road-traffic-light-city-car-ai-generated-modern-technologies-transport-274282396.jpg)] h-screen w-full flex justify-between flex-col bg-red-400 pt-8 ">
        <img src="https://www.freepnglogos.com/uploads/uber-logo-white-png-25.png" alt="" className="w-24 h-6 ml-8"/>
       <div className="bg-white pb-7 py-4 px-4">
        <h2 className="text-[28px] font-bold font-mono">Get Started With Uber</h2>
        <Link to="/login" className="flex items-center justify-center w-full bg-black text-white py-3 rounded mt-4 text-center">Continue</Link>
       </div>
      </div>
      
    </div>
  )
}

export default Start;
