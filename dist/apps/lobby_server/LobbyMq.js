"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../utils/Log"));
var LobbyMq = /** @class */ (function () {
    function LobbyMq() {
    }
    LobbyMq.getInstance = function () {
        return LobbyMq.Instance;
    };
    LobbyMq.prototype.recv_cmd_msg = function (msg, channel) {
        Log_1["default"].info("hcc>>recv:", msg.content.toString());
    };
    LobbyMq.Instance = new LobbyMq();
    return LobbyMq;
}());
exports["default"] = LobbyMq;
//# sourceMappingURL=LobbyMq.js.map