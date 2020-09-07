//服务器配置

/**
 * async await 使用陷阱：
 * 1. async await 使用，一定要配对使用，不然会报错，编译不过
 * 2. 外部函数B，调用asnyc函数A, 如果B本身是一个函数，那么也要加async和await,否则会在执行到A的时候跳过A的，先执行A后面的代码，待A执行异步返回后再执行A的代码， 执行过程就不对了。
 * 3. async，await的函数，如果调用的函数不加await,那么返回值将会是一个Promise,不是你想要的值
 * 5. 简单的说，await函数，会等待结果后再执行下面的方法(前提是await等待的是一个Promise返回值的函数，不然不会生效)
 *

加了await:
await会等待await 执行完成后再执行下面(await必须等待一个Promise,不然不会生效)

不加await:
会先执行await下面的，再执行await

加了async:
函数返回值会变成promise

不加async:
函数返回值不变

外部B调用 async await函数A， B函数的await，加在需要严格执行顺序的方法中，否则不用
 */

import Platform from "../../utils/Platform"
import Log from '../../utils/Log';
import { Stype } from '../protocol/Stype';

let LOCAL_HOST:string = "127.0.0.1"
let WSS_WEBSOCKET_PORT:number = 6081;
let IS_LOCAL_DEBUG:boolean = true; //是否启用本地ip来测试，启用后只能用当前电脑ip调试服务端程序

if(Platform.isWin32()){
	if(IS_LOCAL_DEBUG){
		LOCAL_HOST = Platform.getLocalIP();//本地电脑ip,pc调试用
	}
	WSS_WEBSOCKET_PORT = 6081;
}else if(Platform.isLinux()){
	LOCAL_HOST = "172.16.166.106";//阿里云外网ip
	WSS_WEBSOCKET_PORT = 6061;
}

Log.info("hcc>>localIP: " , LOCAL_HOST);

// websocket wss://172.16.166.106:6061 阿里云服务内网端口
// 6061 服务端内网端口
// 6081 服务端wss外网端口(nginx.conf外网配置)

class GameAppConfig {
	//网关服
	static gateway_config:any  ={
		host: LOCAL_HOST,
		tcp_port: 6080,
		wbsocket_port: WSS_WEBSOCKET_PORT, 
	}

	//web热更新服务
	static hotupdate_webserver:any = {
		host: LOCAL_HOST,
		port: 7000,
	}

	//web配置服务
	static config_webserver: any = {
		host: LOCAL_HOST,
		port: 6091,
	}

	//系统服务
	static game_system_server:any =  {
		host: LOCAL_HOST,
		port: 6087,
		stype: Stype.GameSystem,
	}

	//游戏服务1
	static game_server:any =  {
		host: LOCAL_HOST,
		port: 6088,
		stype: Stype.GameHoodle,
	}

	//游戏服务2
	static game_server_2: any = {
		host: LOCAL_HOST,
		port: 6089,
		stype: Stype.GameHoodle,
	}
	
	//用户中心服务
	static auth_server:any =  {
		host: LOCAL_HOST,
		port: 6086,
		stype: Stype.Auth,
	}
	////////////////////
	//游戏数据库服务
	static game_database:any =  {
		host: LOCAL_HOST,
		port: 3306,
		db_name: "moba_game",
		uname: "root",
		upwd: "123456",
	}

	//用户中心数据库
	static auth_database:any =  {
		host: LOCAL_HOST,
		port: 3306,
		db_name: "auth_center",
		uname: "root",
		upwd: "123456",
	}

	////////////////////
	//游戏房间服务，可拓展多个
	static game_room_server_1:any = {
		host: LOCAL_HOST,
		port: 6090,
		stype: Stype.GameHoodle,
	}
	static game_room_server_2: any = {
		host: LOCAL_HOST,
		port: 6091,
		stype: Stype.GameHoodle,
	}

	static game_room_server_3: any = {
		host: LOCAL_HOST,
		port: 6092,
		stype: Stype.GameHoodle,
	}

	////////////////////

	//网关连接其他服务
	static gw_connect_servers:any =  {
		[1]: GameAppConfig.auth_server,
		[2]: GameAppConfig.game_server,
		[3]: GameAppConfig.game_system_server,
	}

	//大厅服务连接到其他房间服务
	static hall_connect_servers:any = {
		[1]: GameAppConfig.game_room_server_1,
		// [2]: GameAppConfig.game_room_server_2,
		// [3]: GameAppConfig.game_room_server_3,
	}
}

export default GameAppConfig;