import amqp from 'amqplib'
import 'dotenv/config'
async function announcenewProduct(message){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "announce"
        const exchangeType = "fanout"

        await channel.assertExchange(exchange,exchangeType,{durable:true})

        channel.publish(exchange,"",Buffer.from(JSON.stringify(message)),{persistent:true})

        console.log("Message is sent:",message)

        setTimeout(()=>{
            connection.close()
        },500)
    }
    catch(error){
        console.log(error)
    }
}


announcenewProduct({id:122,name:"I pgone lanunched",price:9000000})