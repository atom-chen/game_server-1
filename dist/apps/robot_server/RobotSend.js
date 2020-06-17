"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetBus_1 = __importDefault(require("../../netbus/NetBus"));
var Stype_1 = require("../protocol/Stype");
var RobotSend = /** @class */ (function () {
    function RobotSend() {
    }
    //发给游戏服务
    RobotSend.send_game = function (session, ctype, utag, proto_type, body) {
        NetBus_1["default"].send_cmd(session, Stype_1.Stype.GameSystem, ctype, utag, proto_type, body);
    };
    //发给账号服务
    RobotSend.send_auth = function (session, ctype, utag, proto_type, body) {
        NetBus_1["default"].send_cmd(session, Stype_1.Stype.Auth, ctype, utag, proto_type, body);
    };
    return RobotSend;
}());
exports["default"] = RobotSend;
//# sourceMappingURL=RobotSend.js.map