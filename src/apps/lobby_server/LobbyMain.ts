/*
	服务器启动文件
	注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/

import NetServer from '../../netengine/NetServer';
import ServiceManager from '../../netengine/ServiceManager';
import GameAppConfig from '../config/GameAppConfig';
import LobbyService from './LobbyService';
import Stype from '../protocol/Stype';
import RedisLobby from '../../database/RedisLobby';
import Log from '../../utils/Log';
import MySqlGame from '../../database/MySqlGame';
import RedisGame from '../../database/RedisGame';
import RedisEvent from '../../database/RedisEvent';

let server = GameAppConfig.lobby_server
NetServer.start_tcp_server(server.host, server.port, false);
ServiceManager.register_service(Stype.S_TYPE.Lobby, LobbyService);

//游戏服务数据库
var db_game = GameAppConfig.game_database;
MySqlGame.connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd)

//大厅redis
let lobby_redis_config = GameAppConfig.lobby_redis
RedisLobby.connect(lobby_redis_config.host, lobby_redis_config.port, lobby_redis_config.db_index);

//游戏redis
let game_redis_config = GameAppConfig.game_redis
RedisGame.connect(game_redis_config.host, game_redis_config.port, game_redis_config.db_index);

//事件reids
let event_redis_config = GameAppConfig.event_redis
RedisEvent.connect(event_redis_config.host, event_redis_config.port, event_redis_config.db_index);

