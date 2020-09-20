"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../utils/Log"));
var amqp = require('amqplib');
Log_1["default"].info("amqp: ", amqp);
Log_1["default"].info("test-----------");
var q = 'tasks';
function bail(err) {
    console.error(err);
    process.exit(1);
}
// Publisher
function publisher(conn) {
    conn.createChannel(function (err, ch) {
        if (err != null)
            bail(err);
        ch.assertQueue(q);
        ch.sendToQueue(q, Buffer.from('something to do'));
        Log_1["default"].info("hcc>>send:");
    });
}
// Consumer
function consumer(conn) {
    var ok = conn.createChannel(function (err, ch) {
        if (err != null)
            bail(err);
        ch.assertQueue(q);
        ch.consume(q, function (msg) {
            if (msg !== null) {
                Log_1["default"].info("hcc>>recv: ", msg.content.toString());
                ch.ack(msg);
            }
        });
    });
}
require('amqplib/callback_api')
    .connect('amqp://localhost', function (err, conn) {
    if (err != null)
        bail(err);
    consumer(conn);
    publisher(conn);
});
//# sourceMappingURL=rabbitMQ_test.js.map