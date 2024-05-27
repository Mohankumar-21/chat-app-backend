
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const getUserDetail = async(token) =>
{
    if(!token)
        {
            return {
                message : "session expired",
                logout : true
            }
        }

    const decode = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(decode.id).select("-password");
    if (!user) {
        throw new Error("User not found");
      }
    return user;
}


module.exports = getUserDetail;