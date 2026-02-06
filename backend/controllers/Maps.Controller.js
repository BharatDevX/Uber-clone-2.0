const { validationResult } = require('express-validator');
const mapsService = require('../service/maps.service');

exports.getCoordinates = async (req, res) => {
    const { address } = req.query;
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({
            errors: error.array()
        });
    }
   try{
     if(!address){
        return res.status(400).json({"message": "Address query parameter is required"});
    }
    const coordinates = await mapsService.getAddressCoordinate(address);
    res.status(200).json({coordinates});
   }catch(err){
    res.status(404).json({message: "Error fetching coordinates", err})
   }
}

exports.getDistanceTime = async(req, res) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                errors: error.array()
            })
        }
        const { origin, destination } = req.query;
        if(!origin || !destination){
            return res.status(400).json({message: 'origin and destination are required'});
        }
        const distanceTime = await mapsService.getDistanceTime(origin, destination);
        res.status(200).json({distanceTime});
    }catch(err){
        console.error(err);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
}
exports.getSuggestions = async (req, res, next) => {
    try{
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({
                errors: error.array()
            })
        }
        const { input } = req.query;
        const suggestions = await mapsService.getSuggestions(input);
        res.status(200).json({suggestions});

    }catch(err){

    }

}


