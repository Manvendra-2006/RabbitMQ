import amqp from 'amqplib'
import 'dotenv/config'
async function setup(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const bindingKey = "setup.key"
        await channel.assertExchange("main_exchange","direct",{durable:true})// main excahnge
        await channel.assertExchange("dead_letter_exchange",'direct',{durable:true}) // DLX exchange

        await channel.assertQueue("main_queue",{durable:true,arguments: {
    "x-dead-letter-exchange": "dead_letter_exchange",
    "x-dead-letter-routing-key": "dead"
}})
        await channel.assertQueue("dlx_queue",{durable:true})

        await channel.bindQueue("main_queue","main_exchange",bindingKey)
        await channel.bindQueue("dlx_queue","dead_letter_exchange",'dead')
        console.log("Setup completed")
        await connection.close()
        

    }
    catch(error){
        console.log(error)
    }
}
setup()