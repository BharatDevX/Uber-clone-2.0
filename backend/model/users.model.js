const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
 const bcrypt = require('bcryptjs');  
require('dotenv').config();
const userSchema = new mongoose.Schema({
    firstname: {
            type: String,
            required: true,
            minlength: [3, "First name must be at least 3 characters long"],
            required: [true, "First name is required"],
        },
    lastname: {
            type: String,
            required: true,
            minlength: [3, "Last name must be at least 3 characters long"],
        },
    email: {
        type: String,
        required: true,
        minlength: [5, "Email must be at least 5 characters long"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    
    }
})
userSchema.methods.generateToken = function(){
const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
return token;
}

userSchema.statics.hashedPassword = async function(password){
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      return hashPassword;
}
userSchema.statics.comparePassword = async function(password, hashedPassword){
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

module.exports = mongoose.model('User', userSchema);