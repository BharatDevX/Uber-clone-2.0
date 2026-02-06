const User = require('../model/users.model');
const userService = require('../service/user.service');
const { validationResult } = require('express-validator');
const blacklistToken = require('../model/blocklistToken.model');
exports.register = async(req, res, next) => {
   
     const {firstname, lastname, email, password} = req.body;
     
     try{ 
         const errors = validationResult(req);
         if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
         }
         const users = await User.findOne({email});
         if(users){
            return res.json({
               success: false,
               message: "Account already exist"
            })
         }
         
         const hashPassword = await User.hashedPassword(password);
         const user = await userService.createUser({firstname, lastname, email, password: hashPassword});//IMPortant line 
         const token = user.generateToken();
         res.status(201).json({
            success: true,
            user,
            token,
            message: "Account created successfully"
         });

     }catch(err){
        console.log("Error in register: ", err);
        res.status(500).json({
         success: false,
         message: err.message
        })
     }
}

exports.login = async(req, res, next) => {
 
   const {email, password} = req.body;
   try{
      if(!email || !password){
         return res.json({
            success: false,
            message: "Missing details",
         })
      }
         const user = await User.findOne({email}).select('+password');
         if(!user){
            return res.json({
               success: false,
               messgae: "Invalid email or password",
            })
         }
         const isPasswordValid = await User.comparePassword(password, user.password);
         if(!isPasswordValid){
           return res.json({
               success: false,
               message: "Invalid email or password"
            })
         }
         const token = user.generateToken();
         res.json({
            success: true,
            token,
            user,
            message: "Login successfully"
         })
      
   }catch(err){
      console.log("Error in logging in: ", err);
      res.json({
         success: false,
         message: err.message
      })
   }
}
exports.getUserProfile = (req, res, next) => {
  
res.status(200).json({user: req.user});

}
exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("token");

    let token;
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token found" });
    }

    await blacklistToken.create({ token });
    res.status(200).json({ success: true, message: "Logged Out" });
  } catch (err) {
    next(err);
  }
};
