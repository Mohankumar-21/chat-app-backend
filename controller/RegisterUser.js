const UserModel = require("../models/userModel");
const bcryptjs = require('bcryptjs');


const RegisterUser = async(req,res) =>
{
   try 
   {
      const {name, email, password, profile_pic } = req.body;

      const check = await UserModel.findOne({ email });

      if(check)
         {
            return res.status(400).json({
               message : "User already exists",
               error : true,
            })
         }

       const salt = await bcryptjs.genSalt(10);
       const hashPassword = await bcryptjs.hash(password,salt);

       const payload = {
         name,
         email,
         profile_pic,
         password : hashPassword
       }

       const user = new UserModel(payload);
       const userSave = await user.save(); 

       return res.status(201).json({
          message : "User successfully created",
          data : userSave,
          success : true
       })

   }
   catch(error)
   {
     return res.status(500).json(
        {
            message : "something went wrong"|| error.message || error ,
            error : true
        }
     )
   }
};


module.exports = RegisterUser;