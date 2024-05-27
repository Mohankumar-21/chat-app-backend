const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const getUserDetail = require('../middleware/getUserDetail');
const UserModel = require('../models/userModel');
const {ConversationModel, MessageModel} = require('../models/conversationSchema')



const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"], 
        allowedHeaders: ["Authorization"], 
        credentials: true 
    }
});


const onlineUser = new Set();


io.on('connection',async(socket)=> {


    
    const token = socket.handshake.auth.token;
    //current user details
    const user = await getUserDetail(token)

    //creat separate room for each user
     socket.join(user?._id?.toString());
     onlineUser.add(user?._id?.toString());

     // send all the users so io used
     io.emit('onlineusers', Array.from(onlineUser));

     socket.on('message-page',async(userId)=>
    {
     
        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            _id : userDetails?._id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            online : onlineUser.has(userId)
        }

     socket.emit('message-user', payload);

     //get previous message
       // get previous message 
  
       const getconversation = await ConversationModel.findOne({
        "$or" :
        [
            {
                sender : user?._id,
                receiver : userId
            },
            {
                sender : userId,
                receiver : user?._id
            }
        ]

         // populate used for to get message
    }).populate('message').sort({updatedAt : -1 })

  


     socket.emit('messages',getconversation?.message || [])

    });


  

    //New message from the user 
    socket.on('new-message',async(data)=>
    {

      //check history of users

      let conversation = await ConversationModel.findOne({
        "$or" :
                [
                    {
                        sender : data?.sender,
                        receiver : data?.receiver
                    },
                    {
                        sender : data?.receiver,
                        receiver : data?.sender
                    }
                ]
      })


      //conversation is not available 

      if(!conversation)
        {
           const createnewConversation = await ConversationModel({
            sender : data?.sender,
            receiver : data?.receiver
           })
               
           conversation = await createnewConversation.save();
        }

        const message = await  MessageModel({
            text : data.text,
            imageUrl : data.imageUrl,
            videoUrl : data.videoUrl,
            msgByuserid : data?.msgByuserid
        })
         
        const saveMessage = await message.save();
        
        const updateConversation = await ConversationModel.updateOne({_id : conversation?._id},{
            "$push" : {
                message : saveMessage?._id
            }
        })

        const getconversation = await ConversationModel.findOne({
            "$or" :
            [
                {
                    sender : data?.sender,
                    receiver : data?.receiver
                },
                {
                    sender : data?.receiver,
                    receiver : data?.sender
                }
            ]

             // populate used for to get message
        }).populate('message').sort({updatedAt : -1 })

      
        io.to(data?.sender).emit('messages',getconversation?.message || []);
        io.to(data?.receiver).emit('messages',getconversation?.message || []);
      
    })
     

    //sidebar
    socket.on('sidebar',async(currentuserId)=>
    {
         
        if(currentuserId)
        {
            const currentUserConversation = await ConversationModel.find({
                "$or" : [
                  {
                    sender : currentuserId
                  },
                  {
                    receiver : currentuserId
                  }
                ]
            }).sort({updatedAt : -1}).populate("message").populate("sender").populate("receiver")
    
            const payload = currentUserConversation.map((msg)=>
            {
                const countunSeenMsg = msg.message.reduce((prev,curr)=>
                {
                         return prev+(curr.seen ? 0 : 1)
                },0)
    
               return {
                  _id : msg?._id,
                  sender : msg?.sender,
                  receiver : msg?.receiver,
                  unseenMsg : countunSeenMsg,
                  lastMsg : msg.message[msg?.message?.length - 1]
               }
            })
           
            socket.emit('conversation',payload)
        }

      

    })
    
    //disconnection

     socket.on('disconnect', ()=>
    {
        onlineUser.delete(user?._id);
       

    })

});

module.exports = 
{
    app,
    server
}