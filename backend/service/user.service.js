const User = require("../model/users.model");
exports.createUser = async({
    firstname, lastname, email, password
}) => {
    if(!firstname || !lastname || !password || !email){
        throw new Error("All fields are required");
    }
    
    const user = new User({
        firstname,
        lastname,
        email,
        password
    })
    
    await user.save();
    return user;
}
