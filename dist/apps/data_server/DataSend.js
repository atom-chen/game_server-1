"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var Stype_1 = require("../protocol/Stype");
var ProtoTools_1 = __importDefault(require("../../netbus/ProtoTools"));
var DataSend = /** @class */ (function () {
    function DataSend() {
    }
    //发给游戏服务
    //当前属于服务端，client_session: game_server的session
    DataSend.send_cmd = function (client_session, ctype, utag, body) {
        NetClient_1["default"].send_cmd(client_session, Stype_1.Stype.DataBase, ctype, utag, ProtoTools_1["default"].ProtoType.PROTO_BUF, body);
    };
    return DataSend;
}());
exports["default"] = DataSend;
//# sourceMappingURL=DataSend.js.map