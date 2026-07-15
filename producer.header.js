import amqp from 'amqplib'
import 'dotenv/config'

async function sendNotification(headers,message){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "headers_exchange"
        const exchangeType = "headers"

        await channel.assertExchange(exchange,exchangeType,{durable:true})

        channel.publish(exchange,"",Buffer.from(message),{
            persistent:true,
            headers
        })

        console.log("Sent notifiations with headers")

        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(error){
        console.log(error)
    }
}


sendNotification({"x-match":"all","notification-type":"new_video","content-type":"video"},"New music video uploaded")
sendNotification({"x-match":"all","notification-type":"live_stream","content-type":"gaming"},"Gaming live stream started")
sendNotification({"x-match":"any","notification-type-comment":"comment","content-type":"vlog"},"New comment on your vlog")