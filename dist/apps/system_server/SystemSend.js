"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var SystemSend = /** @class */ (function () {
    function SystemSend() {
    }
    SystemSend.send = function (session, ctype, utag, proto_type, body) {
        NetServer_1["default"].send_cmd(session, Stype_1["default"].S_TYPE.System, ctype, utag, proto_type, body);
    };
    return SystemSend;
}());
exports["default"] = SystemSend;
//# sourceMappingURL=SystemSend.js.map