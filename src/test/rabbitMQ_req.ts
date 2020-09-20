import Log from "../utils/Log";
import * as RabbitMQ from "amqplib"

var QueueTaskName = 'tasks';
/*
//javascript example
// Publisher
function publisher(conn:any) {
    conn.createChannel(function(err:any, channel:any) {
        if (err != null){
            console.error(err);
            return;
        }
        let sendMsg = Buffer.from("hcc>>send msg to queue");
        channel.assertQueue(QueueTaskName);
        channel.sendToQueue(QueueTaskName, sendMsg);
        Log.info("hcc>>send:")
    });
}

//conect to amqp
require('amqplib/callback_api')
    .connect('amqp://localhost', function (err:any, conn:any) {
        if (err != null){
            console.error(err);
            return;
        }
        publisher(conn);
    });
*/

//typescript example
async function testfunc() {
    let connect:RabbitMQ.Connection = await RabbitMQ.connect("amqp://localhost");
    if(connect){
        let channel: RabbitMQ.Channel = await connect.createChannel();
        if(channel){
            let ifok = channel.assertQueue(QueueTaskName); //申明一个要处理的队列
            if(ifok){
                let sendMsg = Buffer.from("hcc>>send msg to queue");
                let issuccess = channel.sendToQueue(QueueTaskName, sendMsg);
                Log.info("hcc>>send " , issuccess == true ? "success" : "failed");
            }
        }
    }
}

setInterval(function(){
    testfunc();
    Log.info("send.....")
},1000)