/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netbus/NetServer';
import ServiceManager from '../../netbus/ServiceManager';
import GameAppConfig from '../config/GameAppConfig';
import Stype from '../protocol/Stype';
import GameRouteService from './GameRouteService';
import NetClient from '../../netbus/NetClient';
import Log from '../../utils/Log';
import GameRouteData from './GameRouteData';
import RedisLobby from '../../database/RedisLobby';

let server = GameAppConfig.game_route_server
NetServer.start_tcp_server(server.host, server.port, false, function (session:any) {
	GameRouteData.set_gateway_session(session);
});
ServiceManager.register_service(Stype.S_TYPE.GameHoodle, GameRouteService);

let logic_server = GameAppConfig.logic_connect_servers;
for (let key in logic_server) {
	let host = logic_server[key].host;
	let port = logic_server[key].port;
	NetClient.connect_tcp_server(host, port, false, logic_server[key].stype, function (server_session: any) {
		Log.info("hcc>>connect to game server success !!");
		GameRouteData.set_logic_server_session(port, server_session);
	});

	NetClient.set_server_disconnect_func(port,function(server_session:any) {
		GameRouteData.delete_logic_server_session(port);
	})
}

//大厅redis
let lobby_redis_config = GameAppConfig.lobby_redis
RedisLobby.connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);