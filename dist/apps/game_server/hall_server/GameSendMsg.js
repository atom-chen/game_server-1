"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../../netbus/NetServer"));
var Stype_1 = require("../../protocol/Stype");
var GameSendMsg = /** @class */ (function () {
    function GameSendMsg() {
    }
    //发协议给session客户端
    GameSendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetServer_1["default"].send_cmd(session, Stype_1.Stype.GameHoodle, ctype, utag, proto_type, body);
    };
    return GameSendMsg;
}());
exports["default"] = GameSendMsg;
//# sourceMappingURL=GameSendMsg.js.map