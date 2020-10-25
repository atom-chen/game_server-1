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
import Stype from '../protocol/Stype';

let LOCAL_HOST:string = "127.0.0.1";
let ALY_CLOUD_HOST: string = "172.16.166.106";
let WSS_WEBSOCKET_PORT:number = 6081;
let IS_LOCAL_DEBUG:boolean = true; //是否启用本地ip来测试，启用后只能用当前电脑ip调试服务端程序

if(Platform.isWin32()){
	if(IS_LOCAL_DEBUG){
		LOCAL_HOST = Platform.getLocalIP();//本地电脑ip,pc调试用
	}
	WSS_WEBSOCKET_PORT = 6081;
}else if(Platform.isLinux()){
	LOCAL_HOST = ALY_CLOUD_HOST;//阿里云外网ip
	WSS_WEBSOCKET_PORT = 6061;
}

Log.info("hcc>>localIP: " , LOCAL_HOST);

// websocket wss://172.16.166.106:6061 阿里云服务内网端口
// 6061 服务端内网端口
// 6081 服务端wss外网端口(nginx.conf外网配置)

class GameAppConfig {
	static getRealLocalIP(){
		return Platform.isWin32() ? Platform.getLocalIP() : ALY_CLOUD_HOST;
	}

	static rabbit_channel_auth = "channel_auth_center"
	static rabbit_channel_game = "rabbit_channel_game"
	static MAX_GAME_SERVER_PLAYER_COUNT = 1000;  //单个逻辑服务承载最大人数

	//网关服
	static gateway_config  ={
		host: LOCAL_HOST,
		tcp_port: 6080,
		wbsocket_port: WSS_WEBSOCKET_PORT, 
	}

	//web热更新服务
	static hotupdate_webserver = {
		host: LOCAL_HOST,
		port: 7000,
	}

	//web配置服务
	static config_webserver = {
		host: LOCAL_HOST,
		port: 6091,
	}

	//用户中心服务
	static auth_server = {
		host: LOCAL_HOST,
		port: 6001,
		stype: Stype.S_TYPE.Auth,
	}

	//大厅服务
	static lobby_server = {
		host: LOCAL_HOST,
		port: 6085,
		stype: Stype.S_TYPE.Lobby,
	}

	//系统服务
	static system_server =  {
		host: LOCAL_HOST,
		port: 6087,
		stype: Stype.S_TYPE.System,
	}

	//游戏route服务
	static game_route_server =  {
		host: LOCAL_HOST,
		port: 6088,
		stype: Stype.S_TYPE.GameHoodle,
	}

	////////////////////
	//游戏数据库服务
	static game_database =  {
		host: LOCAL_HOST,
		port: 3306,
		db_name: "moba_game",
		uname: "root",
		upwd: "123456",
	}

	//用户中心数据库
	static auth_database =  {
		host: LOCAL_HOST,
		port: 3306,
		db_name: "auth_center",
		uname: "root",
		upwd: "123456",
	}

	//MQ中间件服务
	static rabbit_mq_option = {
		hostname: Platform.isWin32() ? "localhost" : LOCAL_HOST,
		port: 5672,
		username:"guest",
		password:"guest",
		protocol:"amqp",
	}

	//用户中心redis
	static auth_center_redis = {
		host: LOCAL_HOST,
		port: 6379,
		db_index:0,
	}

	// 大厅redis
	static lobby_redis = {
		host: LOCAL_HOST,
		port: 6379,
		db_index: 1,
	}

	//游戏redis
	static game_redis = {
		host: LOCAL_HOST,
		port: 6379,
		db_index: 2,
	}

	//event redis 
	static event_redis  = {
		host: LOCAL_HOST,
		port: 6379,
		db_index: 1,
	}

	////////////////////
	//游戏逻辑服务，可拓展多个
	static game_logic_server_1 = {
		host: LOCAL_HOST,
		port: 6090,
		stype: Stype.S_TYPE.GameHoodle,
	}
	static game_logic_server_2 = {
		host: LOCAL_HOST,
		port: 6091,
		stype: Stype.S_TYPE.GameHoodle,
	}

	static game_logic_server_3 = {
		host: LOCAL_HOST,
		port: 6092,
		stype: Stype.S_TYPE.GameHoodle,
	}

	////////////////////

	//网关连接其他服务
	static gw_connect_servers =  [
		GameAppConfig.auth_server,
		GameAppConfig.game_route_server,
		// GameAppConfig.system_server,
		GameAppConfig.lobby_server,
	]
}

export default GameAppConfig;