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
var MysqlSystem_1 = __importDefault(require("../../database/MysqlSystem"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var DataService_1 = __importDefault(require("./DataService"));
var MySqlAuth_1 = __importDefault(require("../../database/MySqlAuth"));
NetBus_1["default"].start_tcp_server(GameAppConfig_1["default"].data_server.host, GameAppConfig_1["default"].data_server.port, false);
for (var server in Stype_1.Stype) {
    ServiceManager_1["default"].register_service(Stype_1.Stype[server], DataService_1["default"]);
}
var game_database = GameAppConfig_1["default"].game_database;
var db_auth = GameAppConfig_1["default"].auth_database;
//系统服务
MysqlSystem_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//游戏服务
MySqlGame_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//账号服务
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
//# sourceMappingURL=DataMain.js.map