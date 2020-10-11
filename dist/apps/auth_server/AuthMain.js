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
var AuthService_1 = __importDefault(require("./AuthService"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var MySqlAuth_1 = __importDefault(require("../../database/MySqlAuth"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var RedisAuth_1 = __importDefault(require("../../database/RedisAuth"));
var auth_server = GameAppConfig_1["default"].auth_server;
NetServer_1["default"].start_tcp_server(auth_server.host, auth_server.port, false);
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.Auth, AuthService_1["default"]);
var db_auth = GameAppConfig_1["default"].auth_database;
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
var auth_redis = GameAppConfig_1["default"].auth_center_redis;
RedisAuth_1["default"].connect(auth_redis.host, auth_redis.port, auth_redis.db_index);
//# sourceMappingURL=AuthMain.js.map