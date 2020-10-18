"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var GameHoodleService_1 = __importDefault(require("./GameHoodleService"));
var MySqlAuth_1 = __importDefault(require("../../database/MySqlAuth"));
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var RedisGame_1 = __importDefault(require("../../database/RedisGame"));
var RedisAuth_1 = __importDefault(require("../../database/RedisAuth"));
var GameServerData_1 = __importDefault(require("./GameServerData"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameRedisMsg_1 = __importDefault(require("./GameRedisMsg"));
var RedisEvent_1 = __importDefault(require("../../database/RedisEvent"));
//开启tcp服务
var game_server = GameAppConfig_1["default"].game_logic_server_1;
NetServer_1["default"].start_tcp_server(game_server.host, game_server.port, false);
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.GameHoodle, GameHoodleService_1["default"]);
GameServerData_1["default"].set_server_key(game_server.port);
//游戏服务
var db_game = GameAppConfig_1["default"].game_database;
MySqlGame_1["default"].connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd);
//用户中心服务
var db_auth = GameAppConfig_1["default"].auth_database;
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
//大厅redis
var lobby_redis_config = GameAppConfig_1["default"].lobby_redis;
RedisLobby_1["default"].connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);
//游戏redis
var game_redis_config = GameAppConfig_1["default"].game_redis;
RedisGame_1["default"].connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);
//auth redis
var auth_redis_config = GameAppConfig_1["default"].auth_center_redis;
RedisAuth_1["default"].connect(auth_redis_config.host, auth_redis_config.port, auth_redis_config.db_index);
//设置人数为0，否则大厅那边找不到当前服务端口，登录不了逻辑服
RedisLobby_1["default"].set_server_playercount(GameServerData_1["default"].get_server_key(), 0);
//事件reids
var event_redis_config = GameAppConfig_1["default"].event_redis;
RedisEvent_1["default"].connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);
RedisEvent_1["default"].on_message(RedisEvent_1["default"].channel_name.lobby_channel, function (channelName, message) {
    Log_1["default"].info("lobby>>recv msg: ", channelName, message);
    GameRedisMsg_1["default"].getInstance().recv_redis_msg(message);
});
//匹配场
// MatchManager.getInstance().start_match();
////////////////////////////////
////////////////////////////////
//内存使用情况打印
/*
function print_memery() {
    var memUsage = process.memoryUsage();
    let cpuUsage = process.cpuUsage();
    var mem_format = function (bytes:number) {
        return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    };
    Log.info('memeryUsage: heapTotal(' + mem_format(memUsage.heapTotal) + ') ,heapUsed(' + mem_format(memUsage.heapUsed) + ') ,rss(' + mem_format(memUsage.rss) + ")");
    Log.info("cpuUsage: system("+ mem_format(cpuUsage.system)+ ") ,user("+  mem_format(cpuUsage.user) + ")");
}

setInterval(function() {
    print_memery();
},1000);
*/ 
//# sourceMappingURL=GameHoodleMain.js.map