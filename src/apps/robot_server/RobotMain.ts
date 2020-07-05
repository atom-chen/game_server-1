/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from "../config/GameAppConfig"
import ServiceManager from "../../netbus/ServiceManager"
import { Stype, StypeName } from '../protocol/Stype'
import RobotService from './RobotService';
import Log from "../../utils/Log";
import NetClient from '../../netbus/NetClient';
import RobotAuthIngerface from './interface/RobotAuthIngerface';

ServiceManager.register_service(Stype.GameHoodle, RobotService);
ServiceManager.register_service(Stype.Auth, RobotService);

// cur server as client connect to game_server
NetClient.connect_tcp_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.tcp_port, false, undefined, on_success_callfunc);

//server_session: gateway的session
function on_success_callfunc(server_session:any) {
	Log.info("robot server success connect to game_server!!!");
	RobotAuthIngerface.robot_login_auth_server(server_session)
}

/**
 *  robot(as client) ----> gateway ----> game_server
 *  game_server ----> gateway -----> robot
 */