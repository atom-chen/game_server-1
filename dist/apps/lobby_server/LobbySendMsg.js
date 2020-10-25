"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netengine/NetServer"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var LobbySendMsg = /** @class */ (function () {
    function LobbySendMsg() {
    }
    //发协议给session客户端
    LobbySendMsg.send = function (session, ctype, utag, proto_type, body) {
        NetServer_1["default"].send_cmd(session, Stype_1["default"].S_TYPE.Lobby, ctype, utag, proto_type, body);
    };
    return LobbySendMsg;
}());
exports["default"] = LobbySendMsg;
//# sourceMappingURL=LobbySendMsg.js.map