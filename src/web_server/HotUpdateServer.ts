//web 热更新服务器
//热更新配置

import * as fs from 'fs';
import * as path from "path";
import express from "express";
import GameAppConfig from '../apps/config/GameAppConfig';
import * as core from "express-serve-static-core";
import Log from '../utils/Log';

let KW_WWW_ROOT_PATH 		= "www_root";
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

function start_hotupdate_server() {
	try {
		let cwdPath = path.join(__dirname, KW_WWW_ROOT_PATH);
		if (fs.existsSync(cwdPath)) {
			app_express.use(express.static(cwdPath));
		}else{
			Log.error("path: ", cwdPath, " is not exists, start hotupdate server failed!");
			return;
		}
	} catch (error) {
		Log.error("start_hotupdate_server error: " , error);
	}
	app_express.listen(GameAppConfig.hotupdate_webserver.port);
	Log.info("start hotupdate server success, address: ", GameAppConfig.hotupdate_webserver.host + ":" + GameAppConfig.hotupdate_webserver.port);
}

start_hotupdate_server();	