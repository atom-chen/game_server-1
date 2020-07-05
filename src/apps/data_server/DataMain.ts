/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import GameAppConfig from "../config/GameAppConfig"
import NetBus from "../../netbus/NetBus"
import ServiceManager from "../../netbus/ServiceManager"
import { Stype, StypeName } from '../protocol/Stype'
import MySqlSystem from "../../database/MysqlSystem"
import MySqlGame from '../../database/MySqlGame';
import DataService from './DataService';
import MySqlAuth from '../../database/MySqlAuth';

NetBus.start_tcp_server(GameAppConfig.data_server.host, GameAppConfig.data_server.port, false);

for(let server in Stype){
    ServiceManager.register_service(Stype[server], DataService);
}


let game_database = GameAppConfig.game_database;
let db_auth = GameAppConfig.auth_database;

//系统服务
MySqlSystem.connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//游戏服务
MySqlGame.connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
//账号服务
MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd)