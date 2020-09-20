import RabbitMQ from '../utils/RabbitMQ';
import Log from '../utils/Log';

let queueName = "hcc_queue_1"

RabbitMQ.recvMsg(queueName, function (msg:any, channel:any) {
    Log.info("hcc>>recv:", msg.content.toString());
})