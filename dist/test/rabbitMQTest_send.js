"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RabbitMQ_1 = __importDefault(require("../utils/RabbitMQ"));
var Log_1 = __importDefault(require("../utils/Log"));
var queueName = "test_channel";
setInterval(function () {
    RabbitMQ_1["default"].sendMsg(queueName, Buffer.from("hcc>>queueName"));
    Log_1["default"].info("send.....");
}, 1000);
//# sourceMappingURL=rabbitMQTest_send.js.map