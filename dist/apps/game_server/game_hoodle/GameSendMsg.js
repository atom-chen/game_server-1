"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetBus_1 = __importDefault(require("../../../netbus/NetBus"));
var Stype_1 = require("../../protocol/Stype");
var GameSendMsg = /** @class */ (function () {
    function GameSendMsg() {
    }
    //发协议给session客户端
    GameSendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetBus_1["default"].send_cmd(session, Stype_1.Stype.GameHoodle, ctype, utag, proto_type, body);
    };
    //模拟客户端发协给当前服务//TODO
    GameSendMsg.send_simulate_client = function (ctype, utag, proto_type, body) {
        // let server_session = NetBus.get_server_session(Stype.GameHoodle);
        // if (server_session){
        //     NetBus.send_cmd(server_session, Stype.GameHoodle, ctype, utag, proto_type, body);
        // }
    };
    return GameSendMsg;
}());
exports["default"] = GameSendMsg;
//# sourceMappingURL=GameSendMsg.js.map