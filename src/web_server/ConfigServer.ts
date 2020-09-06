//web 服务器，获取服务端接口
//热更新配置

import * as fs from 'fs';
import * as path from "path";
import express from "express";
import GameAppConfig from '../apps/config/GameAppConfig';
import * as core from "express-serve-static-core";
import Log from '../utils/Log';

let KW_WWW_ROOT_PATH = "config_root";

let app_express: core.Express = express();

//跨域访问
app_express.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By", ' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

try {
	let cwdPath = path.join(__dirname, KW_WWW_ROOT_PATH);
	if (fs.existsSync(cwdPath)) {
		app_express.use(express.static(cwdPath));
	} else {
		Log.error("path: ", cwdPath, " is not exists, start config server failed!");
	}
} catch (error) {
	Log.error("start_config_server error: ", error);
}

// 获取客户端连接的服务器信息, 
// http://www.hccfun.com:6091/server_info
app_express.get("/server_info", function (request, respones) {
	Log.info("hcc>>get: ", request.url);
	let body = {
		host: GameAppConfig.gateway_config.host,
		tcp_port: GameAppConfig.gateway_config.tcp_port,
		ws_port: GameAppConfig.gateway_config.wbsocket_port,
	};

	let str_data:string = JSON.stringify(body);
	respones.send(str_data);
});

app_express.listen(GameAppConfig.config_webserver.port);
Log.info("start config server success, address: ", GameAppConfig.config_webserver.host + ":" + GameAppConfig.config_webserver.port);
