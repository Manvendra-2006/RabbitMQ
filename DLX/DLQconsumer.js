import amqp  from 'amqplib'
import 'dotenv/config'
async function dlqconsumer(){
    try{
         const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        channel.consume("dlx_queue",(msg)=>{
            if(msg!==null){
                console.log("DLQ CONSUMER RECVIED",JSON.parse(msg.content.toString()))
                channel.ack(msg)
            }
        })

    }
    catch(error){
        console.log(error)
    }

}

dlqconsumer()