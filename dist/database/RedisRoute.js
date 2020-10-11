"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RedisEngine_1 = __importDefault(require("../utils/RedisEngine"));
var RedisRoute = /** @class */ (function () {
    function RedisRoute() {
    }
    RedisRoute.engine = function () {
        return RedisRoute.redisEngine;
    };
    RedisRoute.connect = function (host, port, db_index) {
        RedisRoute.engine().connect(host, port, db_index);
    };
    RedisRoute.redisEngine = new RedisEngine_1["default"]();
    return RedisRoute;
}());
exports["default"] = RedisRoute;
//# sourceMappingURL=RedisRoute.js.map