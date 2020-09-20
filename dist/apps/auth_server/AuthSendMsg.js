"use strict";
//协议发送
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var AuthSendMsg = /** @class */ (function () {
    function AuthSendMsg() {
    }
    //当前作为服务端，发给客户端,session 为客户端session
    AuthSendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetServer_1["default"].send_cmd(session, Stype_1["default"].S_TYPE.Auth, ctype, utag, proto_type, body);
    };
    return AuthSendMsg;
}());
exports["default"] = AuthSendMsg;
//# sourceMappingURL=AuthSendMsg.js.map