"use strict";
//服务器配置
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
/**
 * async await 使用陷阱：
 * 1. async await 使用，一定要配对使用，不然会报错，编译不过
 * 2. 外部函数B，调用asnyc函数A, 如果B本身是一个函数，那么也要加async和await,否则会在执行到A的时候跳过A的，先执行A后面的代码，待A执行异步返回后再执行A的代码， 执行过程就不对了。
 * 3. async，await的函数，如果调用的函数不加await,那么返回值将会是一个Promise,不是你想要的值
 * 5. 简单的说，await函数，会等待结果后再执行下面的方法(前提是await等待的是一个Promise返回值的函数，不然不会生效)
 *

加了await:
await会等待await 执行完成后再执行下面(await必须等待一个Promise,不然不会生效)

不加await:
会先执行await下面的，再执行await

加了async:
函数返回值会变成promise

不加async:
函数返回值不变

外部B调用 async await函数A， B函数的await，加在需要严格执行顺序的方法中，否则不用
 */
var Platform_1 = __importDefault(require("../../utils/Platform"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var LOCAL_HOST = "127.0.0.1";
var ALY_CLOUD_HOST = "172.16.166.106";
var WSS_WEBSOCKET_PORT = 5081;
var IS_LOCAL_DEBUG = true; //是否启用本地ip来测试，启用后只能用当前电脑ip调试服务端程序
if (Platform_1["default"].isWin32()) {
    if (IS_LOCAL_DEBUG) {
        LOCAL_HOST = Platform_1["default"].getLocalIP(); //本地电脑ip,pc调试用
    }
    WSS_WEBSOCKET_PORT = 5081;
}
else if (Platform_1["default"].isLinux()) {
    LOCAL_HOST = ALY_CLOUD_HOST; //阿里云外网ip
    WSS_WEBSOCKET_PORT = 5061;
}
Log_1["default"].info("hcc>>localIP: ", LOCAL_HOST);
// websocket wss://172.16.166.106:6061 阿里云服务内网端口
// 6061 服务端内网端口
// 6081 服务端wss外网端口(nginx.conf外网配置)
var GameAppConfig = /** @class */ (function () {
    function GameAppConfig() {
    }
    GameAppConfig.getRealLocalIP = function () {
        return Platform_1["default"].isWin32() ? Platform_1["default"].getLocalIP() : ALY_CLOUD_HOST;
    };
    GameAppConfig.rabbit_channel_auth = "channel_auth_center";
    GameAppConfig.rabbit_channel_game = "rabbit_channel_game";
    GameAppConfig.MAX_GAME_SERVER_PLAYER_COUNT = 1000; //单个逻辑服务承载最大人数
    //网关服
    GameAppConfig.gateway_config = {
        host: LOCAL_HOST,
        tcp_port: 5080,
        wbsocket_port: WSS_WEBSOCKET_PORT
    };
    //web热更新服务
    GameAppConfig.hotupdate_webserver = {
        host: LOCAL_HOST,
        port: 5000
    };
    //web配置服务
    GameAppConfig.config_webserver = {
        host: LOCAL_HOST,
        port: 5091
    };
    //用户中心服务
    GameAppConfig.auth_server = {
        host: LOCAL_HOST,
        port: 5001,
        stype: Stype_1["default"].S_TYPE.Auth
    };
    //大厅服务
    GameAppConfig.lobby_server = {
        host: LOCAL_HOST,
        port: 5085,
        stype: Stype_1["default"].S_TYPE.Lobby
    };
    //系统服务
    GameAppConfig.system_server = {
        host: LOCAL_HOST,
        port: 5087,
        stype: Stype_1["default"].S_TYPE.System
    };
    //游戏route服务
    GameAppConfig.game_route_server = {
        host: LOCAL_HOST,
        port: 5088,
        stype: Stype_1["default"].S_TYPE.GameHoodle
    };
    ////////////////////
    //游戏数据库服务
    GameAppConfig.game_database = {
        host: LOCAL_HOST,
        port: 3306,
        db_name: "moba_game",
        uname: "root",
        upwd: "123456"
    };
    //用户中心数据库
    GameAppConfig.auth_database = {
        host: LOCAL_HOST,
        port: 3306,
        db_name: "auth_center",
        uname: "root",
        upwd: "123456"
    };
    //MQ中间件服务
    GameAppConfig.rabbit_mq_option = {
        hostname: Platform_1["default"].isWin32() ? "localhost" : LOCAL_HOST,
        port: 5672,
        username: "guest",
        password: "guest",
        protocol: "amqp"
    };
    //用户中心redis
    GameAppConfig.auth_center_redis = {
        host: LOCAL_HOST,
        port: 6379,
        db_index: 0
    };
    // 大厅redis
    GameAppConfig.lobby_redis = {
        host: LOCAL_HOST,
        port: 6379,
        db_index: 1
    };
    //游戏redis
    GameAppConfig.game_redis = {
        host: LOCAL_HOST,
        port: 6379,
        db_index: 2
    };
    //event redis 
    GameAppConfig.event_redis = {
        host: LOCAL_HOST,
        port: 6379,
        db_index: 1
    };
    ////////////////////
    //游戏逻辑服务，可拓展多个
    GameAppConfig.game_logic_server_1 = {
        host: LOCAL_HOST,
        port: 5090,
        stype: Stype_1["default"].S_TYPE.GameHoodle
    };
    GameAppConfig.game_logic_server_2 = {
        host: LOCAL_HOST,
        port: 5091,
        stype: Stype_1["default"].S_TYPE.GameHoodle
    };
    GameAppConfig.game_logic_server_3 = {
        host: LOCAL_HOST,
        port: 5092,
        stype: Stype_1["default"].S_TYPE.GameHoodle
    };
    ////////////////////
    //网关连接其他服务
    GameAppConfig.gw_connect_servers = [
        GameAppConfig.auth_server,
        GameAppConfig.game_route_server,
        // GameAppConfig.system_server,
        GameAppConfig.lobby_server,
    ];
    return GameAppConfig;
}());
exports["default"] = GameAppConfig;
//# sourceMappingURL=GameAppConfig.js.map