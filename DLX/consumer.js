import amqp from 'amqplib'
import 'dotenv/config'
async function consumer(){
    try{
       const connection = await amqp.connect(process.env.RABBITMQ_URL)
       const channel = await connection.createChannel()
       channel.consume("main_queue",(msg)=>{
        if(msg!==null){
            console.log("Message Recived",JSON.parse(msg.content.toString()))
              channel.nack(msg, false, false);
        }
       })
    }
    catch(error){
        console.log(error)
    }
}

consumer()