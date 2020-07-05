"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var Stype_1 = require("../protocol/Stype");
var RobotService_1 = __importDefault(require("./RobotService"));
var Log_1 = __importDefault(require("../../utils/Log"));
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var RobotAuthIngerface_1 = __importDefault(require("./interface/RobotAuthIngerface"));
ServiceManager_1["default"].register_service(Stype_1.Stype.GameHoodle, RobotService_1["default"]);
ServiceManager_1["default"].register_service(Stype_1.Stype.Auth, RobotService_1["default"]);
// cur server as client connect to game_server
NetClient_1["default"].connect_tcp_server(GameAppConfig_1["default"].gateway_config.host, GameAppConfig_1["default"].gateway_config.tcp_port, false, on_success_callfunc);
//server_session: gateway的session
function on_success_callfunc(server_session) {
    Log_1["default"].info("robot server success connect to game_server!!!");
    RobotAuthIngerface_1["default"].robot_login_auth_server(server_session);
}
/**
 *  robot(as client) ----> gateway ----> game_server
 *  game_server ----> gateway -----> robot
 */ 
//# sourceMappingURL=RobotMain.js.map