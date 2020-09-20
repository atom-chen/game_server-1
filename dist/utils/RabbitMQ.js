"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Log_1 = __importDefault(require("./Log"));
var RMQ = __importStar(require("amqplib"));
var util = __importStar(require("util"));
var GameAppConfig_1 = __importDefault(require("../apps/config/GameAppConfig"));
var rabbitConnect = null;
var RabbitMQ = /** @class */ (function () {
    function RabbitMQ() {
    }
    //获取连接
    //default url: "amqp://localhost"
    RabbitMQ.getConnection = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var tmpurl, error_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tmpurl = util.isNullOrUndefined(url) ? GameAppConfig_1["default"].rabbit_mq_option : url;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        if (!util.isNullOrUndefined(rabbitConnect)) return [3 /*break*/, 3];
                        return [4 /*yield*/, RMQ.connect(tmpurl)];
                    case 2:
                        rabbitConnect = _a.sent();
                        rabbitConnect.on("error", function (err) {
                            rabbitConnect = null; //清空失败连接
                            Log_1["default"].error("[\u00D7] RabbitMQ \u5F02\u5E38\u65AD\u7EBF@");
                        });
                        rabbitConnect.on("close", function () {
                            rabbitConnect = null; //清空失败连接
                            Log_1["default"].error("[\u00D7] RabbitMQ \u5F02\u5E38\u65AD\u7EBF!");
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    RabbitMQ.getConnection(tmpurl);
                                    return [2 /*return*/];
                                });
                            }); }, 1000);
                        });
                        Log_1["default"].info("[\u221A] RabbitMQ \u8FDE\u63A5\u6210\u529F!");
                        _a.label = 3;
                    case 3: return [2 /*return*/, rabbitConnect];
                    case 4:
                        error_1 = _a.sent();
                        Log_1["default"].error("[\u00D7] RabbitMQ \u8FDE\u63A5\u9519\u8BEF!", error_1.message);
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                RabbitMQ.getConnection(tmpurl);
                                return [2 /*return*/];
                            });
                        }); }, 1000);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    //获取普通队列，发布者，订阅消费者可用
    RabbitMQ.getQueue = function (queue, options) {
        return __awaiter(this, void 0, void 0, function () {
            var connction, _a, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, RabbitMQ.getConnection(GameAppConfig_1["default"].rabbit_mq_option)];
                    case 1:
                        connction = _b.sent();
                        if (util.isNullOrUndefined(connction)) {
                            return [2 /*return*/];
                        }
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 7, , 8]);
                        if (!util.isNullOrUndefined(connction.channelQueue)) return [3 /*break*/, 4];
                        //每次创建一个channen,其实不是很好，万一没释放就会累积
                        //所以这里暂时只创建一个channel，达到复用
                        _a = connction;
                        return [4 /*yield*/, connction.createChannel()];
                    case 3:
                        //每次创建一个channen,其实不是很好，万一没释放就会累积
                        //所以这里暂时只创建一个channel，达到复用
                        _a.channelQueue = _b.sent();
                        connction.channelQueue.on("close", function (err) {
                            Log_1["default"].error("[\u00D7] RabbitMQ channel\u5F02\u5E38\u65AD\u5F00! close111");
                            if (connction) {
                                connction.channelQueue = null;
                            }
                        });
                        _b.label = 4;
                    case 4:
                        if (!connction.channelQueue) return [3 /*break*/, 6];
                        return [4 /*yield*/, connction.channelQueue.assertQueue(queue, options)];
                    case 5:
                        _b.sent(); //初始化队列
                        return [2 /*return*/, connction.channelQueue];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _b.sent();
                        Log_1["default"].error(error_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    //发布消息到队列
    RabbitMQ.sendMsg = function (queue, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RabbitMQ.getQueue(queue)];
                    case 1:
                        channel = _a.sent();
                        if (!channel) return [3 /*break*/, 3];
                        return [4 /*yield*/, channel.sendToQueue(queue, msg, { persistent: true })
                            // await channel.close(); //每次发送完成后关闭channel，不然会造成channel过多
                        ];
                    case 2: return [2 /*return*/, _a.sent()
                        // await channel.close(); //每次发送完成后关闭channel，不然会造成channel过多
                    ];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //订阅队列消费
    RabbitMQ.recvMsg = function (queue, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var channel;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RabbitMQ.getQueue(queue)];
                    case 1:
                        channel = _a.sent();
                        if (!channel) return [3 /*break*/, 3];
                        channel.prefetch(1);
                        channel.on("close", function (err) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                Log_1["default"].error("[\u00D7] RabbitMQ channel\u5F02\u5E38\u65AD\u5F00! close222");
                                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        RabbitMQ.recvMsg(queue, callback);
                                        return [2 /*return*/];
                                    });
                                }); }, 1000);
                                return [2 /*return*/];
                            });
                        }); });
                        return [4 /*yield*/, channel.consume(queue, function (msg) {
                                if (msg) {
                                    callback(msg, channel);
                                    channel.ack(msg);
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                RabbitMQ.recvMsg(queue, callback);
                                return [2 /*return*/];
                            });
                        }); }, 1000);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RabbitMQ;
}());
exports["default"] = RabbitMQ;
//# sourceMappingURL=RabbitMQ.js.map