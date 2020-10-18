/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netbus/NetServer';
import ServiceManager from '../../netbus/ServiceManager';
import GameAppConfig from '../config/GameAppConfig';
import LobbyService from './LobbyService';
import Stype from '../protocol/Stype';
import RedisLobby from '../../database/RedisLobby';
import Log from '../../utils/Log';
import MySqlGame from '../../database/MySqlGame';
import RedisGame from '../../database/RedisGame';
import RedisEvent from '../../database/RedisEvent';

let server = GameAppConfig.lobby_server
NetServer.start_tcp_server(server.host, server.port, false);
ServiceManager.register_service(Stype.S_TYPE.Lobby, LobbyService);


//游戏服务数据库
var db_game = GameAppConfig.game_database;
MySqlGame.connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd)

//大厅redis
let lobby_redis_config = GameAppConfig.lobby_redis
RedisLobby.connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);

//游戏redis
let game_redis_config = GameAppConfig.game_redis
RedisGame.connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);

//事件reids
let event_redis_config = GameAppConfig.event_redis
RedisEvent.connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);

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



