const Captain = require('../model/captain.model');
const CaptainService = require('../service/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../model/blocklistToken.model');

exports.registerCaptain = async (req, res, next) => {
    const {firstname, lastname, email, password, vehicle} = req.body;
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
           return res.status(400).json({
                error: error.array()
            })
        }
        const captains = await Captain.findOne({email});
        if(captains){
            return res.json({
                success: false,
                message: "Account already exist"
            })
        }
        const hashPassword = await Captain.hashedPassword(password);
        const captain = await CaptainService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashPassword,
            color: vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });
        const token = captain.generateToken();
        res.status(201).json({
            success: true,
            captain,
            token,
            message: "Account created succesfully"
        })
    }catch(err){
        console.log("Error in signing up captain: ", err);
        res.status(401).json({
            success: false,
            message: err.message
        })
    }
}

exports.loginCaptain = async (req, res, next) => {
        const {email, password} = req.body;
        try{
            if(!email || !password){
                return res.status(400).json({
                    success: false,
                    message: "Missing details",
                })
            }
            const captain = await Captain.findOne({email}).select('+password');
            if(!captain){
                return res.status(400).json({
                    success: false,
                    message: "Invalid email or password",
                })
            }
            const isPassword = await Captain.comparePassword(password, captain.password);
            if(!isPassword){
                return res.status(400).json({
                    success: false,
                    message: "Invalid email or password"
                })
            }
            const token = captain.generateToken();
            res.json({
                success: true,
                token,
                captain,
                message: "You have logged in successfully"
            })
        }catch(err){
            console.log("Error in logging in: ", err);
            res.json({
                success: false,
                message: err.message,
            })
        }
}

exports.getCaptainProfile = (req, res, next) => {
    
    res.status(200).json({captain: req.captain});
}

exports.captainLogout = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await blacklistTokenModel.create({ token });
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        token,
        message: "Logout successfully"
    })
}