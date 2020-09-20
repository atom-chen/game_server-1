import RabbitMQ from '../utils/RabbitMQ';
import Log from '../utils/Log';

let queueName = "hcc_queue_1"

setInterval(function () {
    RabbitMQ.sendMsg(queueName, Buffer.from("hcc>>queueName"));
    Log.info("send.....")
}, 1000)

