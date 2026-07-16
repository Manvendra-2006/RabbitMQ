import amqp from 'amqplib'
import 'dotenv/config'


async function sendNotification(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "headers_exchange"
        const exchangeType = "headers"

        await channel.assertExchange(exchange,exchangeType,{durable:true})

    const q =      await channel.assertQueue("",{exclusive:true}) // ye sirf ek connection close kne ke baad auromatically queue remove ho jata hain 
    // temprary queue

       await channel.bindQueue(q.queue,exchange,"",{
        
            "x-match":"all",
            "notification-type":"new_video",
            "content-type":"video"
        
        })


        channel.consume(q.queue,(msg)=>{
            if(msg!==null){
                console.log("message revied: ", msg.content.toString())
                channel.ack(msg)
            }
        })
        
    }
    catch(error){
        console.log(error)
    }
}

sendNotification()