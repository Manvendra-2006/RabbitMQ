import amqp from 'amqplib'
import 'dotenv/config'
async function sendMessage(routingKey,message){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "notification_excahnge"
        const exchangeType = "topic"        
        await channel.assertExchange(exchange,exchangeType,{durable:true})
         
        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)) , {persistent:true})
        console.log("Message Sent",routingKey,JSON.stringify(message))
        console.log(`msg was send with routing key as ${routingKey} and content as ${message} `)

        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(error){
        console.log(error)
    }
}



sendMessage("order.placed",{orderId:123,status:"placed"})
sendMessage("payment.processed",{paymentId:9876,status:"processed"})