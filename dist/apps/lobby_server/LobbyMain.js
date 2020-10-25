"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netengine/NetServer"));
var ServiceManager_1 = __importDefault(require("../../netengine/ServiceManager"));
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var LobbyService_1 = __importDefault(require("./LobbyService"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var RedisGame_1 = __importDefault(require("../../database/RedisGame"));
var RedisEvent_1 = __importDefault(require("../../database/RedisEvent"));
var server = GameAppConfig_1["default"].lobby_server;
NetServer_1["default"].start_tcp_server(server.host, server.port, false);
ServiceManager_1["default"].register_service(Stype_1["default"].S_TYPE.Lobby, LobbyService_1["default"]);
//游戏服务数据库
var db_game = GameAppConfig_1["default"].game_database;
MySqlGame_1["default"].connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd);
//大厅redis
var lobby_redis_config = GameAppConfig_1["default"].lobby_redis;
RedisLobby_1["default"].connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);
//游戏redis
var game_redis_config = GameAppConfig_1["default"].game_redis;
RedisGame_1["default"].connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);
//事件reids
var event_redis_config = GameAppConfig_1["default"].event_redis;
RedisEvent_1["default"].connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);
//# sourceMappingURL=LobbyMain.js.map