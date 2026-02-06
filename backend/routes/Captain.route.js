const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const CaptainController = require('../controllers/Captain.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', [
   body('email').isEmail().withMessage('Invalid Email'),
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
], CaptainController.registerCaptain  
);
router.post('/login', 
    [
        body('email').isEmail().withMessage('Invalid Email'),
        body('password').isLength({min:6}).withMessage('Password should be atleast 6 character long')
    ],
    CaptainController.loginCaptain);

router.get('/profile', auth.authCaptain, CaptainController.getCaptainProfile);

router.get('/logout', auth.authCaptain, CaptainController.captainLogout);
module.exports = router;