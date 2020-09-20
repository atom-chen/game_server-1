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
import LogicRouteSaveSession from './GameRouteSaveSession';

let server = GameAppConfig.game_server
NetServer.start_tcp_server(server.host, server.port, false, function (session:any) {
	LogicRouteSaveSession.set_gateway_session(session);
});
ServiceManager.register_service(Stype.S_TYPE.GameHoodle, GameRouteService);

let logic_server = GameAppConfig.logic_connect_servers;
for (let key in logic_server) {
	NetClient.connect_tcp_server(logic_server[key].host, logic_server[key].port, false, logic_server[key].stype, function (server_session: any) {
		Log.info("hcc>>connect to room server success !!", server_session.session_key);
	});
}