"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../../netbus/NetServer"));
var Stype_1 = require("../../protocol/Stype");
var RoomSendMsg = /** @class */ (function () {
    function RoomSendMsg() {
    }
    //发协议给session客户端
    RoomSendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetServer_1["default"].send_cmd(session, Stype_1.Stype.GameHoodle, ctype, utag, proto_type, body);
    };
    return RoomSendMsg;
}());
exports["default"] = RoomSendMsg;
//# sourceMappingURL=RoomSendMsg.js.map