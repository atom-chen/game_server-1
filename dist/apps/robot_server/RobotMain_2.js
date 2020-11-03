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
var ServiceManager_1 = __importDefault(require("../../netengine/ServiceManager"));
var RobotService_1 = __importDefault(require("./RobotService"));
var Log_1 = __importDefault(require("../../utils/Log"));
var NetClient_1 = __importDefault(require("../../netengine/NetClient"));
var RobotAuthIngerface_1 = __importDefault(require("./interface/RobotAuthIngerface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.GameHoodle, RobotService_1["default"]);
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.Auth, RobotService_1["default"]);
// cur server as client connect to game_server
NetClient_1["default"].connect_tcp_server(GameAppConfig_1["default"].gateway_config.host, GameAppConfig_1["default"].gateway_config.tcp_port, false, undefined, on_success_callfunc);
//server_session: gateway的session
function on_success_callfunc(server_session) {
    Log_1["default"].info("robot server success connect to game_server!!!");
    RobotAuthIngerface_1["default"].robot_login_auth_server(server_session);
}
/**
 *  robot(as client) ----> gateway ----> game_server
 *  game_server ----> gateway -----> robot
 */ 
//# sourceMappingURL=RobotMain_2.js.map