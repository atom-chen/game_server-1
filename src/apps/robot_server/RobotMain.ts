/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from "../config/GameAppConfig"
import NetBus from "../../netbus/NetBus"
import ServiceManager from "../../netbus/ServiceManager"
import { Stype, StypeName } from '../protocol/Stype'
import RobotService from './RobotService';
import MySqlGame from '../../database/MySqlGame';
import MySqlAuth from "../../database/MySqlAuth";
import { Cmd } from "../protocol/GameHoodleProto";
import ProtoTools from "../../netbus/ProtoTools";

ServiceManager.register_service(Stype.Robot, RobotService);

// cur server as client connect to game_server
NetBus.connect_tcp_server(Stype.GameHoodle, GameAppConfig.game_server.host, GameAppConfig.game_server.port, false);

//test robot login logic_server
setInterval(function() {
	let game_server_session =  NetBus.get_server_session(Stype.GameHoodle);
	if (game_server_session){
		let body = { isrobot : true,}
		NetBus.send_cmd(game_server_session, Stype.GameHoodle, Cmd.eLoginLogicReq, 1921, ProtoTools.ProtoType.PROTO_BUF, body);
		NetBus.send_cmd(game_server_session, Stype.GameHoodle, Cmd.eLoginLogicReq, 1922, ProtoTools.ProtoType.PROTO_BUF, body);
		NetBus.send_cmd(game_server_session, Stype.GameHoodle, Cmd.eLoginLogicReq, 1923, ProtoTools.ProtoType.PROTO_BUF, body);
	}
},1000);

// //游戏服务数据库
// let game_database = GameAppConfig.game_database;
// MySqlGame.connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);

// //账号数据库
// let db_auth = GameAppConfig.auth_database;
// MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);


/**
 *  robot -> gateway -> game
 * 
 *  game -> gateway -> robot
 */