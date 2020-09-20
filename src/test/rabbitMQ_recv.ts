import Log from "../utils/Log";
import * as RabbitMQ from "amqplib"
import { ConsumeMessage, Replies } from "amqplib";

var QueueTaskName = 'tasks';
/*
//javascript example
// Consumer
function consumer(conn:any) {
    var ok = conn.createChannel(function (err: any, channel:any) {
        if (err != null){
            console.error(err);
            return;
        } 
        channel.assertQueue(QueueTaskName);
        channel.consume(QueueTaskName, function (msg:any) {
            if (msg !== null) {
                Log.info("hcc>>recv: " , msg.content.toString());
                channel.ack(msg);
            }
        });
    });
}

//conect to amqp
require('amqplib/callback_api')
    .connect('amqp://localhost', function (err:any, conn:any) {
        if (err != null){
            console.error(err);
            return;
        }
        consumer(conn);
    });

*/
//typescript example
async function testfunc() {
    let connect: RabbitMQ.Connection = await RabbitMQ.connect("amqp://localhost");
    if (connect) {
        let channel: RabbitMQ.Channel = await connect.createChannel();
        if (channel) {
            let ifok = channel.assertQueue(QueueTaskName);
            if(ifok){
                let consume:Replies.Consume = await channel.consume(QueueTaskName,function(msg:ConsumeMessage | null) {
                    if(msg){
                        Log.info("hcc>>recv:", msg.content.toString());
                        channel.ack(msg);
                    }
                });
                Log.info("hcc>>recv, consume:", consume);
            }
        }
    }
}

testfunc();
