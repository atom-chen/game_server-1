/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netengine/NetServer';
import ServiceManager from '../../netengine/ServiceManager';
import MySqlGame from '../../database/MySqlGame';
import GameHoodleService from './GameHoodleService';
import MySqlAuth from '../../database/MySqlAuth';
import GameAppConfig from '../config/GameAppConfig';
import Stype from '../protocol/Stype';
import RedisLobby from '../../database/RedisLobby';
import RedisGame from '../../database/RedisGame';
import RedisAuth from '../../database/RedisAuth';
import GameServerData from './GameServerData';
import Log from '../../utils/Log';
import GameRedisMsg from './GameRedisMsg';
import RedisEvent from '../../database/RedisEvent';
import * as Redis from 'redis';

let game_server_config = GameAppConfig.game_logic_server_2;

/////////////////////////
//游戏服务数据库
var db_game = GameAppConfig.game_database;
MySqlGame.connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd)

//用户中心服务数据库
var db_auth = GameAppConfig.auth_database;
MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd)
/////////////////////////

/////////////////////////
//大厅redis
let lobby_redis_config = GameAppConfig.lobby_redis
RedisLobby.connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);

//游戏redis
let game_redis_config = GameAppConfig.game_redis
RedisGame.connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);

//auth redis
let auth_redis_config = GameAppConfig.auth_center_redis
RedisAuth.connect(auth_redis_config.host, auth_redis_config.port, auth_redis_config.db_index);

//事件reids
let event_redis_config = GameAppConfig.event_redis;
RedisEvent.connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);
/////////////////////////

let publish_redis_connect_func = function() {
	let obj = {
		xy_name: RedisEvent.game_route_channel_msg.route_connect_gameserver,
		host: game_server_config.host,
		port: game_server_config.port,
		stype: game_server_config.stype,
	}
	try {
		let obj_str = JSON.stringify(obj);
		let redis_dup: Redis.RedisClient = RedisEvent.engine().get_dup_engine();
		if (redis_dup) {
			redis_dup.publish(RedisEvent.channel_name.gameroute_channel, obj_str);
		}
	} catch (error) {
		Log.error("hcc>>start_tcp_server", error);
	}
}

RedisEvent.on_message(RedisEvent.channel_name.lobby_channel, function (channelName: string, message: string) {
	// Log.info("lobby>>recv msg111: ", channelName, message);
	if (channelName == RedisEvent.channel_name.lobby_channel){
		GameRedisMsg.getInstance().recv_redis_msg(message);
	}
})

RedisEvent.on_message(RedisEvent.channel_name.gameroute_channel, function (channelName: string, message: string) {
	// Log.info("gameroute>>recv msg222: ", channelName, message);
	if (channelName == RedisEvent.channel_name.gameroute_channel) {
		try {
			let msg_obj = JSON.parse(message);
			if (msg_obj && msg_obj.xy_name == RedisEvent.game_route_channel_msg.game_route_restart) {
				publish_redis_connect_func();
			}
		} catch (error) {
			Log.error("GameHoodleMain>>redisEvent>>", error);
		}
	}
})

//开启tcp服务
NetServer.start_tcp_server(game_server_config.host, game_server_config.port, false, undefined ,function(){
	publish_redis_connect_func();
});

ServiceManager.register_service(Stype.S_TYPE.GameHoodle, GameHoodleService);
GameServerData.set_server_key(game_server_config.port);
//设置人数为0，否则大厅那边找不到当前服务端口，登录不了逻辑服
RedisLobby.set_server_playercount(GameServerData.get_server_key(), 0);


////////////////////////////////
////////////////////////////////
//内存使用情况打印
/*
function print_memery() {
	var memUsage = process.memoryUsage();
	let cpuUsage = process.cpuUsage();
	var mem_format = function (bytes:number) {
		return (bytes / 1024 / 1024).toFixed(2) + 'MB';
	};
	Log.info('memeryUsage: heapTotal(' + mem_format(memUsage.heapTotal) + ') ,heapUsed(' + mem_format(memUsage.heapUsed) + ') ,rss(' + mem_format(memUsage.rss) + ")");
	Log.info("cpuUsage: system("+ mem_format(cpuUsage.system)+ ") ,user("+  mem_format(cpuUsage.user) + ")");
}

setInterval(function() {
	print_memery();
},1000);
*/