"use strict";
//协议发送
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetBus_1 = __importDefault(require("../../netbus/NetBus"));
var Stype_1 = require("../protocol/Stype");
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var server_session_map = {}; //当前连接的服务器session
var AuthSendMsg = /** @class */ (function () {
    function AuthSendMsg() {
    }
    //保存当前所连接的服务session
    AuthSendMsg.save_server_session = function (server_session, stype) {
        server_session_map[stype] = server_session;
    };
    //获取服务session
    AuthSendMsg.get_server_session = function (stype) {
        return server_session_map[stype];
    };
    //当前作为服务端，发给客户端,session 为客户端session
    AuthSendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetBus_1["default"].send_cmd(session, Stype_1.Stype.Auth, ctype, utag, proto_type, body);
    };
    //当前作为客户端，发给data_server, server_session已经保存
    AuthSendMsg.send_data_server = function (ctype, utag, proto_type, body) {
        var server_session = AuthSendMsg.get_server_session(Stype_1.Stype.DataBase);
        NetClient_1["default"].send_cmd(server_session, Stype_1.Stype.DataBase, ctype, utag, proto_type, body);
    };
    return AuthSendMsg;
}());
exports["default"] = AuthSendMsg;
//# sourceMappingURL=AuthSendMsg.js.map