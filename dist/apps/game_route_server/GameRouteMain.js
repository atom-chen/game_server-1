"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
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
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netengine/NetServer"));
var ServiceManager_1 = __importDefault(require("../../netengine/ServiceManager"));
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var GameRouteService_1 = __importDefault(require("./GameRouteService"));
var NetClient_1 = __importDefault(require("../../netengine/NetClient"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameRouteData_1 = __importDefault(require("./GameRouteData"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var RedisEvent_1 = __importDefault(require("../../database/RedisEvent"));
var route_server_config = GameAppConfig_1["default"].game_route_server;
///////////////////////////////////连接到其他服务
var connect_to_game_server = function (host, port, stype) {
    var session = GameRouteData_1["default"].get_logic_server_session(port);
    if (session) { //连接过一次就自动回重连，不用再次根据redis消息连接
        Log_1["default"].warn("hcc>> address:", host, port, "is connected in the past!!!");
        return;
    }
    NetClient_1["default"].connect_tcp_server(host, port, false, stype, function (server_session) {
        Log_1["default"].info("hcc>>connect to game server success !!", host, port, stype);
        GameRouteData_1["default"].set_logic_server_session(port, server_session);
        RedisLobby_1["default"].set_server_playercount(String(port), 0);
    });
    NetClient_1["default"].set_server_disconnect_func(port, function (server_session) {
        return __awaiter(this, void 0, void 0, function () {
            var remotePort, exist, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Log_1["default"].warn("hcc>> game_server port:", port, "is lost connected!!");
                        remotePort = String(server_session.remotePort);
                        return [4 /*yield*/, RedisLobby_1["default"].is_server_exist(remotePort)];
                    case 1:
                        exist = _a.sent();
                        if (!exist) return [3 /*break*/, 3];
                        return [4 /*yield*/, RedisLobby_1["default"].delete_server_info(remotePort)];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            Log_1["default"].warn("hcc>> server info :", remotePort, "is delete!!");
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    });
};
//大厅redis
var lobby_redis_config = GameAppConfig_1["default"].lobby_redis;
RedisLobby_1["default"].connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);
//使用redis事件来监听 逻辑服务是否开启了，开启了的话就连接上去
var event_redis_config = GameAppConfig_1["default"].event_redis;
RedisEvent_1["default"].connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);
/*
message:
{
    xy_name: "route_connect_gameserver",
    ip:"127.0.0.1",
    port:6379,
}
*/
RedisEvent_1["default"].on_message(RedisEvent_1["default"].channel_name.gameroute_channel, function (channelName, message) {
    Log_1["default"].info("lobby>>recv msg: ", channelName, message);
    if (channelName != RedisEvent_1["default"].channel_name.gameroute_channel) {
        return;
    }
    try {
        var msg_obj = JSON.parse(message);
        if (msg_obj && msg_obj.xy_name == RedisEvent_1["default"].game_route_channel_msg.route_connect_gameserver) {
            var host = msg_obj.host;
            var port = msg_obj.port;
            var stype = msg_obj.stype;
            if (host && port && stype) {
                connect_to_game_server(host, Number(port), Number(stype));
            }
        }
    }
    catch (error) {
        Log_1["default"].error("GameRouteMain>>redisEvent>>", error);
    }
});
//////////////////////////////////开启tcp服务
NetServer_1["default"].start_tcp_server(route_server_config.host, route_server_config.port, false, function (session) {
    GameRouteData_1["default"].set_gateway_session(session);
}, function () {
    var obj = {
        xy_name: RedisEvent_1["default"].game_route_channel_msg.game_route_restart
    };
    var redis_dup = RedisEvent_1["default"].engine().get_dup_engine();
    if (redis_dup) {
        redis_dup.publish(RedisEvent_1["default"].channel_name.gameroute_channel, JSON.stringify(obj));
    }
});
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.GameHoodle, GameRouteService_1["default"]);
//# sourceMappingURL=GameRouteMain.js.map