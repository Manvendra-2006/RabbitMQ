import amqp from 'amqplib'
import 'dotenv/config'
async function pushReceiveMessage(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
     
        const exchange = "announce"
        
        await channel.assertExchange(exchange,'fanout',{durable:true})

        const queue = await channel.assertQueue("",{exclusive:true})
        console.log(queue) //ye object return kargega

            // exclusive true means connection cloase queue delete
        await channel.bindQueue(queue.queue,exchange,"")
        channel.consume(queue.queue,(message)=>{
            if(message!==null){
            console.log("Message Recueved : ",JSON.stringify(message))
            channel.ack(message)
            }
          
        })
        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(error){
        console.log(error)
    }
}