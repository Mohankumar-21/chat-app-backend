const mongoose = require('mongoose');

const connectDB = async()=>{
    try
    {
        await mongoose.connect(process.env.MONGO_URL);

        const connection = mongoose.connection;
        connection.on('connected',()=>
        {
            console.log('MongoDB connection is established');
        })

        connection.on('error',(error)=>
        {
            console.log('Error in mongoDB', error);
        })
    }
    catch(error){
         console.log('Something went wrong', error)
    }
};

module.exports = connectDB;