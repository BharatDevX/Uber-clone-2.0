const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const captainSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
        type: String,
        minlength: [3, "Lastname must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, "Email must be at least 5 characters long"]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive', 
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, "Color must be at least 3 characters long"],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, "Plate must be at least 3 characters long"],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto', 'bike', 'scooty'],
        }
    },
    // ✅ Fixed location for GeoJSON
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            default: [0, 0]
        }
    }
});

// 2dsphere index for geospatial queries
captainSchema.index({ location: "2dsphere" });

// Token & Password methods
captainSchema.methods.generateToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
    return token;
}

captainSchema.statics.hashedPassword = async function(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

captainSchema.statics.comparePassword = async function(password, hashPassword){
    return await bcrypt.compare(password, hashPassword);
}

module.exports = mongoose.model("Captain", captainSchema);
