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
var RobotInterface_1 = __importDefault(require("./interface/RobotInterface"));
var Log_1 = __importDefault(require("../../utils/Log"));
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
ServiceManager_1["default"].register_service(Stype_1.Stype.Robot, RobotService_1["default"]);
// cur server as client connect to game_server
// NetBus.connect_tcp_server(Stype.GameHoodle, GameAppConfig.game_server.host, GameAppConfig.game_server.port, false, on_success_callfunc);
NetClient_1["default"].connect_tcp_server(GameAppConfig_1["default"].gateway_config.host, GameAppConfig_1["default"].gateway_config.tcp_port, false, on_success_callfunc);
function on_success_callfunc() {
    Log_1["default"].info("robot server success connect to game_server!!!");
    RobotInterface_1["default"].robot_login_logic_server();
}
/**
 *  robot(as client) ----connect----> game_server
 *  game_server ----send data-----> robot
 */ 
//# sourceMappingURL=RobotMain.js.map