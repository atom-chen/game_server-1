/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from "../config/GameAppConfig"
import NetBus from "../../netbus/NetBus"
import ServiceManager from "../../netbus/ServiceManager"
import { Stype, StypeName } from '../protocol/Stype'
import RobotService from './RobotService';
import BornRobot from './interface/RobotInterface';
import Log from "../../utils/Log";
import NetClient from '../../netbus/NetClient';

ServiceManager.register_service(Stype.GameHoodle, RobotService);

// cur server as client connect to game_server
// NetBus.connect_tcp_server(Stype.GameHoodle, GameAppConfig.game_server.host, GameAppConfig.game_server.port, false, on_success_callfunc);

NetClient.connect_tcp_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.tcp_port, false, on_success_callfunc);

function on_success_callfunc(server_session:any) {
	Log.info("robot server success connect to game_server!!!");
	BornRobot.robot_login_logic_server(server_session);
}

/**
 *  robot(as client) ----connect----> game_server
 *  game_server ----send data-----> robot
 */