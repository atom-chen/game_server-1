/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from '../config/GameAppConfig';
import NetBus from "../../netbus/NetBus"
import GatewayService from "./GatewayService"
import ServiceManager from "../../netbus/ServiceManager"
import NetClient from '../../netbus/NetClient';
import GatewayFunction from './GatewayFunction';

NetBus.start_tcp_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.tcp_port, false)
NetBus.start_ws_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.wbsocket_port, false)

// 连接其他服务器
var game_server = GameAppConfig.gw_connect_servers;
for(var key in game_server) {
	NetClient.connect_tcp_server(game_server[key].host, game_server[key].port, false, game_server[key].stype, function(server_session:any) {
		GatewayFunction.save_server_session(server_session,server_session.stype);
	});
	ServiceManager.register_service(game_server[key].stype, GatewayService);
}