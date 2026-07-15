import amqp from 'amqplib'
import 'dotenv/config'
async function ReceiveNotification(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()

        await channel.assertQueue("send_notif",{durable:false})

        channel.consume("send_notif",(message)=>{
            console.log("jjd",message.content)
            console.log("Recived Message",message.content.toString())
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

ReceiveNotification()