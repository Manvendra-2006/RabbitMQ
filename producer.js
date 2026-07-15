import amqp from 'amqplib'
import 'dotenv/config'

async function sendMail(){
    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL)
        const channel = await connection.createChannel()
        const exchange = "mail_exchange"
        const routingKey1 = "send_mail"
        const bindinKey1 = "send_mail"
        const routingKey2 = "send_notification"
        const bindinKey2 = "send_notification"
        const message = {
            to:"rahul34@gmail.com",
            from:"jkdk@gmail.com",
            subject:"Hello TP mail",
            body:"hello ied djddd"
        }
        const notification= "kdkdkdkdkdkkd"
        await channel.assertExchange(exchange,'direct',{durable:false})  // durable false means data persistent nhi hoga matlb refresh hone par message jaa bhi skata hain ya nhi bhi 
        await channel.assertQueue("mail_queue",{durable:false})
        await channel.assertQueue("send_notif",{durable:false})
        // durable false means jab server slow ho jata hain toh ye queue main store nhi hota hain
        // durable true means jab server fast ho jata hain toh ye queue main stroe ho jata hain

        await channel.bindQueue("mail_queue",exchange,bindinKey1) // isme queue aur exchange binding ho rhe hain by the help of binding key 
        await channel.bindQueue("send_notif",exchange,bindinKey2)
        channel.publish(exchange,routingKey1,Buffer.from(JSON.stringify(message)))
        channel.publish(exchange,routingKey2,Buffer.from(notification))
        console.log("Mail Data was sent",message)
        console.log("Notification data was send",notification)
        setTimeout(()=>{
            connection.close()  // isko hum time dete hain ki 0.5 second main connection close karna 
        },500)
    }   
    catch(error){
        console.log(error)
    }
}

sendMail()