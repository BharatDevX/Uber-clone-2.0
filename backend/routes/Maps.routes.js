const express = require('express');
const router = express.Router();
const MapsController = require('../controllers/Maps.Controller');
const Auth = require('../middleware/auth.middleware');
const { query } = require('express-validator');

router.get('/get-coordinates', 
    query('address').notEmpty().withMessage('Address is required').isString().isLength({ min: 3 }).withMessage('Invalid address'),
    Auth.authUser, MapsController.getCoordinates);

router.get('/get-distance-time', 
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min:3}),
    Auth.authUser,
    MapsController.getDistanceTime
)

router.get('/get-suggestions', 
    query('input').notEmpty().withMessage('Input is required').isString().isLength({ min: 3}),
    Auth.authUser,
    MapsController.getSuggestions
)
module.exports = router;
