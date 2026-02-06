const jwt = require('jsonwebtoken');
const User = require('../model/users.model');
const blacklistTokenModel = require('../model/blocklistToken.model');
const bcrypt = require('bcryptjs');
const captainModel = require('../model/captain.model');
require("dotenv").config();

exports.authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        const token = 
            (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode._id);
   
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        return next();  // ✅ only call next if everything passes
    } catch (err) {
        console.log("Error in authUser: ", err.message);
        return res.status(401).json({
            success: false,
            message: "Invalid Token",
        });
    }
};

exports.authCaptain = async (req, res, next) => {
    try {
         const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
        
const token = authHeader.split(" ")[1];
        const isBlacklisted = await blacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decode._id);
        
        
        if (!captain) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.captain = captain;
        
        return next();  // ✅ safe to call
    } catch (err) {
        console.log("Error in authCaptain: ", err);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
