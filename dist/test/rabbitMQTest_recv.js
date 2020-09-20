"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RabbitMQ_1 = __importDefault(require("../utils/RabbitMQ"));
var Log_1 = __importDefault(require("../utils/Log"));
var queueName = "hcc_queue_1";
RabbitMQ_1["default"].recvMsg(queueName, function (msg, channel) {
    Log_1["default"].info("hcc>>recv:", msg.content.toString());
});
//# sourceMappingURL=rabbitMQTest_recv.js.map