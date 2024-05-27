const getUserDetail = require('../middleware/getUserDetail');
const UserModel = require('../models/userModel');

const updateUserDetail = async(req,res)=>
{
   try
   {
      const token = req.cookies.token || "" ;
      const user = await getUserDetail(token);

      if (!user || !user._id) {
        throw new Error("User not found or invalid token");
      }

      const { name,profile_pic } = req.body ;


      const updateUser = await UserModel.updateOne({_id : user._id},
        {
            name,
            profile_pic
        }
      )

      const userInformation = await UserModel.findById(user._id);

      return res.json({
        message : "user updated successfully",
        data : userInformation,
        success :true
      })

   }
   catch(error)
   {
    return res.status(500).json({
        message : error.message || error,
        error : true
    })
   }
};

module.exports = updateUserDetail;