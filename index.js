const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Database/connectDB');
const router = require('./routes/index');
const cookieparser = require('cookie-parser');
const {app,server} = require('./socket/socket')

dotenv.config();
// Create instance
// const app = express();  //refer
app.use(express.json())

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true, 
  };
app.use(cors(corsOptions));
app.use(cookieparser());

const PORT = process.env.PORT || 8000;

app.get('/',(req,res)=>
{
    res.send('Server is running');
});

//api end points
app.use('/api', router);

//connect DB
connectDB();
connectDB().then(()=>
{
server.listen(PORT, ()=>
        {
            console.log(`Server is running at ${PORT}`);
    })
})

