
const UserModel = require('../models/userModel');

const checkEmail = async (req,res) =>
{
   try
   {
      const {email} = req.body;

      const check = await UserModel.findOne({email}).select("-password");
      if(!check)
        {
            return res.status(400).json({
                message : 'user not exist',
                error : true
            })
        }

        return res.status(200).json({
            message : 'Email verified',
            success : true,
            data : check
        })

   }
   catch(error)
   {
      return res.status(500).json({
        message : error.message || error || "something went wrong",
        error : true
      })
   }
}


module.exports = checkEmail;