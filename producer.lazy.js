import amqp from 'amqplib'
import 'dotenv/config'

async function setup(message){
    const connection = await amqp.connect(process.env.RABBITMQ_URL)
    const channel = await connection.createChannel()
    const exchangeName = "notification_exchange"
    const queueName = "lazy_notifications_queue"
    const routingKey = "notification.key"

    await channel.assertExchange(exchangeName,'direct',{durable:true})

    await channel.assertQueue(queueName,{durable:true,
            arguments:{
                "x-queue-mode":"lazy" // yaha par lazy queue , queue ki property hain isliyeyaha likhe 
            }
    })
    await channel.bindQueue(queueName,exchangeName,routingKey)
    channel.publish(exchangeName,routingKey,Buffer.from(message),{persistent:true})
    console.log("message sent",message)
    setTimeout(() => {
        connection.close()
    }, 500);
}

setup("hello from me ")