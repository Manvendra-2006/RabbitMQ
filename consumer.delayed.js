import amqp from 'amqplib'
import 'dotenv/config'

async function processOrderUpdates(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const queue = "delayed_queue"
        await channel.assertQueue(queue,{durable:true})
        channel.consume(queue,async (batch)=>{
            if(batch!==null){
                const data = JSON.parse(batch.content.toString())
                console.log(data)
                console.log(`Processing order update task for batch : ${data.batchId} and ${data.orders}`)
                // orders.forEach((item)=>{
                //     console.log(item.orderId)
                // })
                channel.ack(batch)
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

processOrderUpdates()