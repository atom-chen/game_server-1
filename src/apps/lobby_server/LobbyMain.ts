/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netbus/NetServer';
import ServiceManager from '../../netbus/ServiceManager';
import GameAppConfig from '../config/GameAppConfig';
import LobbyService from './LobbyService';
import Stype from '../protocol/Stype';

let server = GameAppConfig.lobby_server
NetServer.start_tcp_server(server.host, server.port, false);
ServiceManager.register_service(Stype.S_TYPE.Lobby, LobbyService);