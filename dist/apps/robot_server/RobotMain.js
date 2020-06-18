"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js, 再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var NetBus_1 = __importDefault(require("../../netbus/NetBus"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var Stype_1 = require("../protocol/Stype");
var RobotService_1 = __importDefault(require("./RobotService"));
var GameHoodleProto_1 = require("../protocol/GameHoodleProto");
var ProtoTools_1 = __importDefault(require("../../netbus/ProtoTools"));
ServiceManager_1["default"].register_service(Stype_1.Stype.Robot, RobotService_1["default"]);
// cur server as client connect to game_server
NetBus_1["default"].connect_tcp_server(Stype_1.Stype.GameHoodle, GameAppConfig_1["default"].game_server.host, GameAppConfig_1["default"].game_server.port, false);
setInterval(function () {
    var game_server_session = NetBus_1["default"].get_server_session(Stype_1.Stype.GameHoodle);
    if (game_server_session) {
        var body = { isrobot: true };
        NetBus_1["default"].send_cmd(game_server_session, Stype_1.Stype.GameHoodle, GameHoodleProto_1.Cmd.eLoginLogicReq, 1921, ProtoTools_1["default"].ProtoType.PROTO_BUF, body);
    }
}, 3000);
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
//# sourceMappingURL=RobotMain.js.map