/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from '../config/GameAppConfig';
import NetServer from "../../netbus/NetServer"
import GatewayService from "./GatewayService"
import ServiceManager from '../../netbus/ServiceManager';
import NetClient from '../../netbus/NetClient';
import GatewayFunction from './GatewayHandle';
import Log from '../../utils/Log';
import * as util from 'util';
import Platform from '../../utils/Platform';
import * as fs from 'fs';
import * as path from "path";
import { StypeName } from '../protocol/Stype';

NetServer.start_tcp_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.tcp_port, false)
NetServer.start_ws_server(GameAppConfig.gateway_config.host, GameAppConfig.gateway_config.wbsocket_port, false)

// 连接其他服务器

var game_server = GameAppConfig.gw_connect_servers;
for(var key in game_server) {
	NetClient.connect_tcp_server(game_server[key].host, game_server[key].port, false, game_server[key].stype, function(server_session:any) {
		GatewayFunction.save_server_session(server_session,server_session.stype);
	});
	ServiceManager.register_service(game_server[key].stype, GatewayService);
}

/*
let connect_server_callBack = function(status:boolean, data:any) {
	if(status == true){
		let gw_connect_servers = data.gw_connect_servers;
		// Log.info("hcc>>gw_connect_servers:", gw_connect_servers);
		for (let k in gw_connect_servers){
			let serverInfo = gw_connect_servers[k];
			let name = serverInfo.name;
			let host = serverInfo.host;
			let port = serverInfo.port;
			let stype = serverInfo.stype;
			let isOpen = serverInfo.isOpen;
			if(name && host && port && stype){
				if (isOpen == true){
					if (util.isNullOrUndefined(ServiceManager.get_service(stype))){
						let server_seeeion = GatewayFunction.get_server_session(stype);
						if (util.isNullOrUndefined(server_seeeion)){
							NetClient.connect_tcp_server(host, port, false, stype, function (server_session: any) {
								GatewayFunction.save_server_session(server_session, server_session.stype);
							});
						}
						ServiceManager.register_service(stype, GatewayService);
						// Log.info("hcc>>ServiceManager.register_service" , stype)
					}
				}else{
					let server_seeeion = GatewayFunction.get_server_session(stype);
					if (!util.isNullOrUndefined(server_seeeion)){
						ServiceManager.unregister_service(stype); //使协议发送不到该服务，但是该服务还是开启的，并没有close
						Log.warn('【' + StypeName[stype] + '】', "ServiceManager.unregister_service !!")
					}
				}
			}
		}
	}
}

let local_host: string = "127.0.0.1"
let config_file_name = ""
if (Platform.isWin32()) {
	local_host = Platform.getLocalIP();//本地电脑ip,pc调试用
	config_file_name = "server_config_local.json"
} else if (Platform.isLinux()) {
	local_host = "172.16.166.106";//阿里云外网ip
	config_file_name = "server_config_remote.json"
}

//轮询读取本地配置来实现连接其他服务器
//实现修改配置来开启/停止服务器
let file = __dirname + "../../../web_server/config_root/server_config/" + config_file_name;
setInterval(function () {
	// 异步读取本地配置
	fs.readFile(file, function (err:any, data:any) {
			if (err) {
				Log.error(err);
				return 
			}
		// Log.info("异步读取: " + data.toString());
		let dataString:string = data.toString()
		if(Platform.isWin32()){
			dataString = dataString.replace(/127.0.0.1/g, local_host);
		}
		if (dataString){
			try {
				let jsonObj = JSON.parse(dataString);
				if(jsonObj){
					connect_server_callBack(true,jsonObj)
				}
			} catch (error) {
				Log.error(error);
			}
		}
	});
}, 1000);
*/