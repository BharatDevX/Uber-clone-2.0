const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected succesfully");
    } catch(err){
        console.log("Error in connecting mongodb: ", err);
    }
}

module.exports = connectDB;