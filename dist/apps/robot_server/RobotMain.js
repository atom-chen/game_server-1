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
var NetBus_1 = __importDefault(require("../../netbus/NetBus"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var Stype_1 = require("../protocol/Stype");
var RobotService_1 = __importDefault(require("./RobotService"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var MySqlAuth_1 = __importDefault(require("../../database/MySqlAuth"));
var system_server = GameAppConfig_1["default"].game_system_server;
NetBus_1["default"].start_tcp_server(system_server.host, system_server.port, false);
ServiceManager_1["default"].register_service(Stype_1.Stype.GameSystem, RobotService_1["default"]);
//游戏服务数据库
var game_database = GameAppConfig_1["default"].game_database;
MySqlGame_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//账号数据库
var db_auth = GameAppConfig_1["default"].auth_database;
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
/**
 *  robot -> gateway -> game
 *
 *  game -> gateway -> robot
 */ 
//# sourceMappingURL=RobotMain.js.map