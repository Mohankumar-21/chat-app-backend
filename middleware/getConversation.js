
const { ConversationModel } = require('../models/conversationSchema');

const getConversation = async(currentuserId) =>
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
               
                 return payload;

                // socket.emit('conversation',payload)
            }
            else{
                return [];
            }
    
          
    }


    module.exports = getConversation;