/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../../netbus/NetServer';
import ServiceManager from '../../../netbus/ServiceManager';
import { Stype } from '../../protocol/Stype';
import GameAppConfig from '../../config/GameAppConfig';
import Log from '../../../utils/Log';
import GameBallService from './GameBallService';

let game_room_server = GameAppConfig.game_room_server_1
NetServer.start_tcp_server(game_room_server.host, game_room_server.port, false);
ServiceManager.register_service(Stype.GameHoodle, GameBallService);