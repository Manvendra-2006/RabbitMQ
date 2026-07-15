import amqp from 'amqplib'
import 'dotenv/config'
async function receiveMail(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()

        await channel.assertQueue("mail_queue",{durable:false})

        channel.consume("mail_queue",(message)=>{
            if(message!=null){
                console.log("Recv Message",JSON.parse(message.content))
                channel.ack(message)
            }
        })
    }
    catch(error){
        console.log(error)
    }
}

receiveMail()