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
var Stype_1 = require("../protocol/Stype");
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var Log_1 = __importDefault(require("../../utils/Log"));
var DataBaseProto_1 = require("../protocol/DataBaseProto");
var ProtoTools_1 = __importDefault(require("../../netbus/ProtoTools"));
var AuthSendMsg_1 = __importDefault(require("./AuthSendMsg"));
var auth_server = GameAppConfig_1["default"].auth_server;
NetBus_1["default"].start_tcp_server(auth_server.host, auth_server.port, false);
ServiceManager_1["default"].register_service(Stype_1.Stype.Auth, AuthService_1["default"]);
ServiceManager_1["default"].register_service(Stype_1.Stype.DataBase, AuthService_1["default"]); //便于DataBase服务转发数据给当前服务
NetClient_1["default"].connect_tcp_server(GameAppConfig_1["default"].data_server.host, GameAppConfig_1["default"].data_server.port, false, Stype_1.Stype.DataBase, on_success_callfunc);
function on_success_callfunc(server_session) {
    AuthSendMsg_1["default"].save_server_session(server_session, server_session.stype);
    Log_1["default"].info("auth server success connect to data_server!!!");
    var body = {
        uname: "hcc",
        upwd: "hccpwd"
    };
    //stype.database 表示当前发给database服务的
    // NetClient.send_cmd(server_session, Stype.DataBase, Cmd.eAuthUinfoReq, 0, ProtoTools.ProtoType.PROTO_BUF, body);
    AuthSendMsg_1["default"].send_data_server(DataBaseProto_1.Cmd.eAuthUinfoReq, 0, ProtoTools_1["default"].ProtoType.PROTO_BUF, body);
}
// let db_auth = GameAppConfig.auth_database;
// MySqlAuth.connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd)
//# sourceMappingURL=AuthMain.js.map