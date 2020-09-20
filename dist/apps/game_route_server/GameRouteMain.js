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
var GameRouteSaveSession_1 = __importDefault(require("./GameRouteSaveSession"));
var server = GameAppConfig_1["default"].game_server;
NetServer_1["default"].start_tcp_server(server.host, server.port, false, function (session) {
    GameRouteSaveSession_1["default"].set_gateway_session(session);
});
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.GameHoodle, GameRouteService_1["default"]);
var logic_server = GameAppConfig_1["default"].logic_connect_servers;
for (var key in logic_server) {
    NetClient_1["default"].connect_tcp_server(logic_server[key].host, logic_server[key].port, false, logic_server[key].stype, function (server_session) {
        Log_1["default"].info("hcc>>connect to room server success !!", server_session.session_key);
    });
}
//# sourceMappingURL=GameRouteMain.js.map