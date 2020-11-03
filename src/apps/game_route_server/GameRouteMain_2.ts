/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netengine/NetServer';
import ServiceManager from '../../netengine/ServiceManager';
import GameAppConfig from '../config/GameAppConfig';
import Stype from '../protocol/Stype';
import GameRouteService from './GameRouteService';
import NetClient from '../../netengine/NetClient';
import Log from '../../utils/Log';
import GameRouteData from './GameRouteData';
import RedisLobby from '../../database/RedisLobby';
import RedisEvent from '../../database/RedisEvent';
import * as Redis from 'redis';

let route_server_config = GameAppConfig.game_route_server

///////////////////////////////////连接到其他服务
let connect_to_game_server = function (host: string, port: number, stype:number) {
	let session = GameRouteData.get_logic_server_session(port);
	if (session){ //连接过一次就自动回重连，不用再次根据redis消息连接
		Log.warn("hcc>> address:" , host , port , "is connected in the past!!!");
		return;
	}
	NetClient.connect_tcp_server(host, port, false, stype, function (server_session: any) {
		Log.info("hcc>>connect to game server success !!",host, port, stype);
		GameRouteData.set_logic_server_session(port, server_session);
		RedisLobby.set_server_playercount(String(port), 0);
	});

	NetClient.set_server_disconnect_func(port, async function (server_session: any) {
		Log.warn("hcc>> game_server port:", port, "is lost connected!!");
		let remotePort = String(server_session.remotePort);
		let exist = await RedisLobby.is_server_exist(remotePort);
		if(exist){
			let ret = await RedisLobby.delete_server_info(remotePort);
			if(ret){
				Log.warn("hcc>> server info :" , remotePort , "is delete!!");
			}
		}
	});
}

//大厅redis
let lobby_redis_config = GameAppConfig.lobby_redis
RedisLobby.connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);

//使用redis事件来监听 逻辑服务是否开启了，开启了的话就连接上去
let event_redis_config = GameAppConfig.event_redis;
RedisEvent.connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);

/*
message: 
{
	xy_name: "route_connect_gameserver",
	ip:"127.0.0.1",
	port:6379,
}
*/
RedisEvent.on_message(RedisEvent.channel_name.gameroute_channel, function (channelName: string, message: string) {
	Log.info("lobby>>recv msg: ", channelName, message);
	if (channelName != RedisEvent.channel_name.gameroute_channel){
		return;
	}
	try {
		let msg_obj = JSON.parse(message);
		if (msg_obj && msg_obj.xy_name == RedisEvent.game_route_channel_msg.route_connect_gameserver){
			let host = msg_obj.host;
			let port = msg_obj.port;
			let stype = msg_obj.stype;
			if(host && port && stype){
				connect_to_game_server(host, Number(port), Number(stype));
			}
		}
	} catch (error) {
		Log.error("GameRouteMain>>redisEvent>>",error);
	}
})


//////////////////////////////////开启tcp服务
NetServer.start_tcp_server(route_server_config.host, route_server_config.port, false, 
function (session: any) {
	GameRouteData.set_gateway_session(session);
},
function () {
	let obj = {
		xy_name: RedisEvent.game_route_channel_msg.game_route_restart,
	}
	let redis_dup: Redis.RedisClient = RedisEvent.engine().get_dup_engine();
	if (redis_dup) {
		redis_dup.publish(RedisEvent.channel_name.gameroute_channel, JSON.stringify(obj));
	}
});
ServiceManager.register_service(Stype.S_TYPE.GameHoodle, GameRouteService);