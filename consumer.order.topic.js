import amqp from 'amqplib'
import 'dotenv/config'
async function receiveMessage(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "notification_excahnge"
        const queue = "order_queue"
        await channel.assertExchange(exchange,'topic',{durable:true})
        await channel.assertQueue(queue,{durable:true})

        await channel.bindQueue(queue,exchange,"order.*")

        channel.consume(queue,(message)=>{
            if(message!==null){
                console.log("Message was recieved :",JSON.parse(message.content))
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


receiveMessage()