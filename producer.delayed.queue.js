import amqp from 'amqplib'
import 'dotenv/config'

async function sendtoDelayedQueue(batchId,orders,delay){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "delayed_exchange"

        await channel.assertExchange(exchange,"x-delayed-message",{durable:true,arguments:{"x-delayed-type":"direct"}})
        // x-delayed-message ye exchange type hain sirf rabbitmq delayed message exchange plugin provide karta hain 
        const queue = "delayed_queue"
        await channel.assertQueue(queue,{durable:true})
        await channel.bindQueue(queue,exchange,"")

        const message = JSON.stringify({batchId,orders})
        channel.publish(exchange,"",Buffer.from(message),{
            headers:{"x-delay":delay}
        })

        console.log(`Sent batch ${batchId} update task to delayed queue with ${delay} ms delay`)
        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(error){
        console.log(error)
    }
}

sendtoDelayedQueue(123,[{orderId:1223,itme:"iphone",quantity:1},{orderId:455,item:"samsung",quantity:2}],10000)
