import amqp from 'amqplib'
import 'dotenv/config'
async function consumerMessage(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const queue = "priority_queue"

       await channel.assertQueue(queue,{durable:true,arguments:{"x-max-priority":10}})

       channel.consume(queue,(message)=>{
        if(message!==null){
            console.log(`Received : ${message.content.toString()}`)
        }
       })
    }
    catch(error){
        console.log(error)
    }
}
consumerMessage()