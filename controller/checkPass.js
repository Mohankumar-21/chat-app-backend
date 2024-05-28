const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const checkPass = async (req,res) =>
{
    res.header('Access-Control-Allow-Origin', `${process.env.FRONTEND_URL}`);
    res.header('Access-Control-Allow-Credentials', true);

   try
   {
      const {password,userId} = req.body;
   

      const user = await UserModel.findById(userId);
      const verifyPassword = await bcrypt.compare(password,user.password);


      if(!verifyPassword)
        {
            return res.status(400).json({
                message : 'Wrong password',
                error : true
            })
        }

        const tokenData = {
           id : user._id,
           email : user.email
        }

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn :'1d' });
        const cookieOption = {
            httpOnly : true,
            secure : true
        }


        return res.cookie('token', token , cookieOption).status(200).json({
            message : 'Login Successfully',
            success : true,
            token :token
        })

   }
   catch(error)
   {
      return res.status(500).json({
        message : error?.message || error || "Something went wrong",
        error : true
      })
   }
}


module.exports = checkPass;