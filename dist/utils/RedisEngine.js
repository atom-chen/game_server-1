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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Redis = __importStar(require("redis"));
var Log_1 = __importDefault(require("./Log"));
var util = __importStar(require("util"));
var GameAppConfig_1 = __importDefault(require("../apps/config/GameAppConfig"));
var RedisEngine = /** @class */ (function () {
    function RedisEngine() {
        this._host = "";
        this._port = 0;
        this._db_index = 0;
        this._redis_client = null;
        this._message_func = null;
    }
    RedisEngine.prototype.get_engine = function () {
        return this._redis_client;
    };
    RedisEngine.prototype.connect = function (host, port, db_index) {
        this._db_index = db_index || 0;
        this._host = host || GameAppConfig_1["default"].getRealLocalIP();
        this._port = port || 6379;
        this._redis_client = Redis.createClient({
            host: this._host,
            port: this._port,
            db: this._db_index
        });
        this._redis_client.on("error", function (error) {
            Log_1["default"].error(error);
        });
        this._redis_client.on("clientError", function (error) {
            Log_1["default"].error("redis clientError!!!", error);
        });
        this._redis_client.on("close", function (error) {
            Log_1["default"].error("redis close!!!", error);
        });
        this._redis_client.on("end", function (error) {
            Log_1["default"].error("redis end!!!", error);
        });
        this._redis_client.on("subscribe", function (channel, count) {
            Log_1["default"].info("redis subscribe:", channel, count);
        });
        var _this = this;
        this._redis_client.on("message", function (channel, message) {
            // Log.info("redis message:", channel, message);
            if (_this._message_func) {
                _this._message_func(channel, message);
            }
        });
    };
    //订阅频道消息
    RedisEngine.prototype.listen_channel = function (channelName, func) {
        if (!this.get_engine()) {
            Log_1["default"].error("redis client is null!");
            return;
        }
        this.get_engine().subscribe(channelName);
        this._message_func = func;
        Log_1["default"].info("listen channel: ", channelName, "success!!");
    };
    //取消订阅消息
    RedisEngine.prototype.unlisten_channel = function (channelName) {
        if (!this.get_engine()) {
            Log_1["default"].error("redis client is null!");
            return;
        }
        this.get_engine().unsubscribe(channelName);
        Log_1["default"].info("unsubscribe channel: ", channelName, "success!!");
    };
    //发布消息到频道
    RedisEngine.prototype.publish_msg = function (channelName, msg) {
        if (!this.get_engine()) {
            Log_1["default"].error("redis client is null!");
            return;
        }
        this.get_engine().publish(channelName, msg);
    };
    //删除 成功返回1
    RedisEngine.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().del);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), key)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        Log_1["default"].error("delete>>", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //存字符串 成功返回 1
    RedisEngine.prototype.set = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().set);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), key, value)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_2 = _a.sent();
                        Log_1["default"].error("set>>", error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取字符串 成功返回字符串
    RedisEngine.prototype.get = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().get);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), key)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_3 = _a.sent();
                        Log_1["default"].error("get>>", error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //哈希存储一个完整table，成功返回'OK' ,data:table
    RedisEngine.prototype.hmset = function (table_name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hmset);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name, data)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_4 = _a.sent();
                        Log_1["default"].error("hmset>>", error_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //哈希存储，成功返回 1 , field:键 , value值
    //table如果不存在会创建
    RedisEngine.prototype.hset = function (table_name, field, value) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hset);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name, field, value)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_5 = _a.sent();
                        Log_1["default"].error("hset>>", error_5);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取哈希全部字段和值
    RedisEngine.prototype.hgetall = function (table_name) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hgetall);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_6 = _a.sent();
                        Log_1["default"].error("hgetall>>", error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取哈希表某个字段
    //存在返回值，不存在返回null
    RedisEngine.prototype.hget = function (table_name, field) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hget);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name, field)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_7 = _a.sent();
                        Log_1["default"].error("hget>>", error_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //删除哈希表某个字段，成功返回1， 否则返回0
    RedisEngine.prototype.hdelete = function (table_name, field) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hdel);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name, field)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_8 = _a.sent();
                        Log_1["default"].error("hdelete>>", error_8);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //查看table_name 中某个字段是否存在, 存在返回1，否则返回0
    RedisEngine.prototype.hexist = function (table_name, field) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().hexists);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), table_name, field)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_9 = _a.sent();
                        Log_1["default"].error("hexist>>", error_9);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //有序集合存储
    RedisEngine.prototype.zadd = function (add_key, count, mark) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().zadd);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), add_key, count, mark)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_10 = _a.sent();
                        Log_1["default"].error("zadd>>", error_10);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //有序集合:从大到小获取
    RedisEngine.prototype.zrevrange = function (query_key, from_num, to_num) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().zrevrange);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), query_key, from_num, to_num, "withscores")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_11 = _a.sent();
                        Log_1["default"].error("zrevrange>>", error_11);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //有序集合:从小到大获取
    RedisEngine.prototype.zrange = function (query_key, from_num, to_num) {
        return __awaiter(this, void 0, void 0, function () {
            var async_func, result, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.get_engine()) {
                            Log_1["default"].error("redis client is null!");
                            return [2 /*return*/];
                        }
                        async_func = util.promisify(this.get_engine().zrange);
                        if (!async_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, async_func.call(this.get_engine(), query_key, from_num, to_num, "withscores")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_12 = _a.sent();
                        Log_1["default"].error("zrange>>", error_12);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return RedisEngine;
}());
exports["default"] = RedisEngine;
//# sourceMappingURL=RedisEngine.js.map