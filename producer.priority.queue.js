import amqp from 'amqplib'
import 'dotenv/config'
async function sendMessage(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "priority_exchange"
        const queue = "priority_queue"
        const routingKey = "priority_key"
         const bindingKey = "priority_key"

         await channel.assertExchange(exchange,'direct',{durable:true})
         await channel.assertQueue(queue,{durable:true,arguments:{"x-max-priority":10}})

         await channel.bindQueue(queue,exchange,bindingKey)

         const data = [
            {
                msg:"Hello low : 1",
                priority:1
            },
            {
                msg:"hello low : 1",
                priority:1
            },
            {
                msg:"hello mid : 2",
                priority:2
            }
         ]

         data.map((msg)=>{
            channel.publish(exchange,routingKey,Buffer.from(msg.msg),{priority:msg.priority})            
         })

         console.log("All message sent")

         setTimeout(()=>{
            connection.close()
         },500)
    }
    catch(error){
        console.log(error)
    }
}

sendMessage()