/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from "../config/GameAppConfig"
import NetBus from "../../netbus/NetBus"
import AuthService from "./AuthService"
import ServiceManager from "../../netbus/ServiceManager"
import MySqlAuth from "../../database/MySqlAuth"
import {Stype,StypeName} from '../protocol/Stype'
import NetClient from "../../netbus/NetClient"
import Log from "../../utils/Log"
import { Cmd } from "../protocol/DataBaseProto"
import ProtoTools from '../../netbus/ProtoTools';
import AuthSendMsg from './AuthSendMsg';

let auth_server = GameAppConfig.auth_server;
NetBus.start_tcp_server(auth_server.host, auth_server.port, false);
ServiceManager.register_service(Stype.Auth, AuthService);
// ServiceManager.register_service(Stype.DataBase, AuthService); //便于DataBase服务转发数据给当前服务

let db_auth = GameAppConfig.auth_database;
MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);

//连接数据服务
/*
NetClient.connect_tcp_server(GameAppConfig.data_server.host, GameAppConfig.data_server.port, false, Stype.DataBase ,on_success_callfunc);
function on_success_callfunc(server_session: any) {
	AuthSendMsg.save_server_session(server_session, server_session.stype);
	Log.info("auth server success connect to data_server!!!");
	
	//test
	// let body = {
	// 	uname : "hcc",
	// 	upwd : "hccpwd",
	// }
	// AuthSendMsg.send_data_server(Cmd.eAuthUinfoReq, 0, ProtoTools.ProtoType.PROTO_BUF, body);
}
*/



