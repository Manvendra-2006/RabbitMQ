import amqp  from 'amqplib'
import 'dotenv/config'
async function Producer(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const data = {
            orderId:123,
            item:"i phone",
            price:45500
        }
       await channel.publish("main_exchange","setup.key",Buffer.from(JSON.stringify(data)),{persistent:true})
       
       setTimeout(()=>{
        console.log("Data SENT")
        connection.close()
       },500)

    }
    catch(error){
        console.log(error)
    }
}

Producer()