import amqp from 'amqplib'
import 'dotenv/config'
async function receiveMessage(){
        try{
            const connection = await amqp.connect(process.env.RABBITMQ_URL)
            const channel = await connection.createChannel()
            const exchange = "notification_excahnge"
            const queue = "payment_queue"

            await channel.assertExchange(exchange,'topic',{durable:true})
            await channel.assertQueue(queue,{durable:true})

            await channel.bindQueue(queue,exchange,"payment.*")

            channel.consume(queue,(message)=>{
                console.log("Message was received : ", JSON.parse(message.content))
                channel.ack(message)
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