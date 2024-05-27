const UserModel = require('../models/userModel')

const SearchUser = async(req,res) =>
{
        try
        {
           const {search}  = req.body;

           const query = new RegExp(search, "i", "g");
           const user = await UserModel.find({
               "$or" : [
                {name : query},
                {email :query}
               ]
           }).select("-password");
            
           return res.json({
              message : "All user shown",
              data : user,
              success : true
           })
        }
        catch(error)
        {
            return res.status(500).json({
                message : error.message || error || "something went wrong",
                error : true
            })
        }
};


module.exports = SearchUser;