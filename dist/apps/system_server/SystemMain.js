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
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var Stype_1 = require("../protocol/Stype");
var SystemService_1 = __importDefault(require("./SystemService"));
var MysqlSystem_1 = __importDefault(require("../../database/MysqlSystem"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var system_server = GameAppConfig_1["default"].game_system_server;
NetServer_1["default"].start_tcp_server(system_server.host, system_server.port, false);
ServiceManager_1["default"].register_service(Stype_1.Stype.GameSystem, SystemService_1["default"]);
var game_database = GameAppConfig_1["default"].game_database;
//系统服务
MysqlSystem_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//游戏服务
MySqlGame_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//# sourceMappingURL=SystemMain.js.map