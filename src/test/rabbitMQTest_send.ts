import RabbitMQ from '../utils/RabbitMQ';
import Log from '../utils/Log';

let queueName = "test_channel"

setInterval(function () {
    RabbitMQ.sendMsg(queueName, Buffer.from("hcc>>queueName"));
    Log.info("send.....")
}, 1000)

