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
var LobbyService_1 = __importDefault(require("./LobbyService"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var MySqlGame_1 = __importDefault(require("../../database/MySqlGame"));
var RedisGame_1 = __importDefault(require("../../database/RedisGame"));
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
/////////////////////////////
/*
//test
let uid = 1001;
let roomid = "123456";
let gamerule = {
    playCount : 3,
    playerCount:2,
}

let roominfo_obj = {
    roomid: roomid,
    uids: [1001, 1002, 1003, 444444],
    gamerule: JSON.stringify(gamerule),
    game_server_id: 1,
    ex_info: "xxxfsfdfsdfsdf",
};

let roominfo_json = JSON.stringify(roominfo_obj);

// RedisLobby.save_roomid_roominfo_inredis(roomid, roominfo_json);
// RedisLobby.save_uid_roominfo_inredis(uid, roominfo_json);
// RedisLobby.save_uid_roominfo_inredis(1002, roominfo_json);
// RedisLobby.save_uid_roominfo_inredis(1003, roominfo_json);

async function  testst() {
    let ret = null;
    // let isexist = await RedisLobby.uid_is_exist_in_room(uid)
    // let isexist2 = await RedisLobby.uid_is_exist_in_room(789)
    // Log.info("1111111111", isexist, isexist2)

    // ret = await RedisLobby.delete_uid_to_roominfo(uid)
    // ret = await RedisLobby.delete_uid_in_roominfo(roomid, uid)
    // ret = await RedisLobby.get_all_uid_roominfo();
    // ret = await RedisLobby.generate_roomid();

    Log.info("-------", ret);
}

// testst()
*/
//# sourceMappingURL=LobbyMain.js.map