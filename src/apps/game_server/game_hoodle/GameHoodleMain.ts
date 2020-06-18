/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetBus from '../../../netbus/NetBus';
import ServiceManager from '../../../netbus/ServiceManager';
import { Stype } from '../../protocol/Stype';
import MySqlGame from '../../../database/MySqlGame';
import GameHoodleService from './GameHoodleService';
import MySqlAuth from '../../../database/MySqlAuth';
import MatchManager from './MatchManager';
import GameAppConfig from '../../config/GameAppConfig';
import Log from '../../../utils/Log';

let game_server = GameAppConfig.game_server;
NetBus.start_tcp_server(game_server.host, game_server.port, false);

ServiceManager.register_service(Stype.GameHoodle, GameHoodleService);

//游戏服务
var db_game = GameAppConfig.game_database;
MySqlGame.connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd)

//用户中心服务
var db_auth = GameAppConfig.auth_database;
MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd)

//匹配场
MatchManager.getInstance().start_match();

//内存使用打印
function print_memery() {
	var memUsage = process.memoryUsage();
	let cpuUsage = process.cpuUsage();
	var mem_format = function (bytes:number) {
		return (bytes / 1024 / 1024).toFixed(2) + 'MB';
	};
	Log.info('memeryUsage: heapTotal(' + mem_format(memUsage.heapTotal) + ') ,heapUsed(' + mem_format(memUsage.heapUsed) + ') ,rss(' + mem_format(memUsage.rss) + ")");
	Log.info("cpuUsage: system("+ mem_format(cpuUsage.system)+ ") ,user("+  mem_format(cpuUsage.user) + ")");
}

// setInterval(function() {
// 	print_memery();
// },1000);