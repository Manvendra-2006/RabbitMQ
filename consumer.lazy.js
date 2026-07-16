import amqp from  'amqplib'
import 'dotenv/config'
async function receiveMessage(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "notification_exchange"
        const queue = "lazy_notifications_queue"
         const routingKey = "notification.key"
         await channel.assertExchange(exchange,'direct',{durable:true})
           await channel.assertQueue(queue,{durable:true,
            arguments:{
                "x-queue-mode":"lazy" // yaha par lazy queue , queue ki property hain isliyeyaha likhe 
            }
    })
         await channel.bindQueue(queue,exchange,routingKey)

         channel.consume(queue,(message)=>{
            if(message!==null){
                console.log("Message is sent ",message.content.toString())
                channel.ack(message)
            }
         })

    }
    catch(error){
        console.log(error)
    }
}

receiveMessage()