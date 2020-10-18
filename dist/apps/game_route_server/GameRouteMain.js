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
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var GameRouteService_1 = __importDefault(require("./GameRouteService"));
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameRouteData_1 = __importDefault(require("./GameRouteData"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var server = GameAppConfig_1["default"].game_route_server;
NetServer_1["default"].start_tcp_server(server.host, server.port, false, function (session) {
    GameRouteData_1["default"].set_gateway_session(session);
});
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.GameHoodle, GameRouteService_1["default"]);
var logic_server = GameAppConfig_1["default"].logic_connect_servers;
var _loop_1 = function (key) {
    var host = logic_server[key].host;
    var port = logic_server[key].port;
    NetClient_1["default"].connect_tcp_server(host, port, false, logic_server[key].stype, function (server_session) {
        Log_1["default"].info("hcc>>connect to game server success !!");
        GameRouteData_1["default"].set_logic_server_session(port, server_session);
    });
    NetClient_1["default"].set_server_disconnect_func(port, function (server_session) {
        GameRouteData_1["default"].delete_logic_server_session(port);
    });
};
for (var key in logic_server) {
    _loop_1(key);
}
//大厅redis
var lobby_redis_config = GameAppConfig_1["default"].lobby_redis;
RedisLobby_1["default"].connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);
//# sourceMappingURL=GameRouteMain.js.map