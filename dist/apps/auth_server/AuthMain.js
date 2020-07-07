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
var AuthService_1 = __importDefault(require("./AuthService"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var MySqlAuth_1 = __importDefault(require("../../database/MySqlAuth"));
var Stype_1 = require("../protocol/Stype");
var auth_server = GameAppConfig_1["default"].auth_server;
NetBus_1["default"].start_tcp_server(auth_server.host, auth_server.port, false);
ServiceManager_1["default"].register_service(Stype_1.Stype.Auth, AuthService_1["default"]);
// ServiceManager.register_service(Stype.DataBase, AuthService); //便于DataBase服务转发数据给当前服务
var db_auth = GameAppConfig_1["default"].auth_database;
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
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
//# sourceMappingURL=AuthMain.js.map