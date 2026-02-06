const Captain = require('../model/captain.model');


exports.createCaptain = async ({firstname, lastname, email, password, color, plate, capacity, vehicleType}) => {
    if(!firstname || !lastname || !password || !email || !color || !plate || !capacity || !vehicleType){
        throw new Error("All fields are required");
    }
    const captain = new Captain({
        firstname,
        lastname,
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType,
        }

    })
    await captain.save();
    return captain;
}