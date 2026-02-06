const express = require('express');
const router = express.Router();
const RideController = require('../controllers/Ride.Controller');
const Auth = require('../middleware/auth.middleware');
const { body, query } = require('express-validator');

router.post('/create-ride', 
    Auth.authUser,
    body('pickup').isString().isLength({min:3}).withMessage('Invalid pickup location'),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination location'),
    body('vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid vehicle type'),
    
    RideController.createRide)

router.get('/get-fare', 
    Auth.authUser,
    query('pickup').isString().isLength({min:3}).withMessage("Invalid pickup location"),
    query('destination').isString().isLength({min:3}).withMessage("Invalid destination"),
     RideController.getFare)

router.post('/confirm-ride', Auth.authCaptain, 
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    RideController.confirmRide
)

router.get('/start-ride', Auth.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride Id'),
    query('otp').isLength({min: 4, max: 4}).withMessage('Invalid OTP'),
    RideController.startRide
)
router.post('/end-ride', Auth.authCaptain, 
    body('rideId').isMongoId().withMessage('Invalid ride ID'),
    RideController.endRide,
)
module.exports = router;