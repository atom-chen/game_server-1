"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ws = require("ws");
var ProtoManager_1 = __importDefault(require("../netbus/ProtoManager"));
var Platform_1 = __importDefault(require("../utils/Platform"));
var Log_1 = __importDefault(require("../utils/Log"));
var Stype_1 = __importDefault(require("../apps/protocol/Stype"));
var AuthProto_1 = __importDefault(require("../apps/protocol/protofile/AuthProto"));
var local = "ws://127.0.0.1:6081";
var remote = "ws://www.hccfun.com:6081";
var hoststr = Platform_1["default"].isWin32() ? local : remote;
Log_1["default"].info(hoststr);
var sock = new ws(local);
var proto_type = 2;
sock.on("open", function () {
    Log_1["default"].info("connect success !!!!");
    var stype = Stype_1["default"].S_TYPE.Auth;
    var ctype = AuthProto_1["default"].XY_ID.REQ_UNAMELOGIN;
    var utag = 0;
    var body = {
        uname: "test2222",
        upwd: "111111"
    };
    var cmd = ProtoManager_1["default"].encode_cmd(stype, ctype, utag, proto_type, body);
    setInterval(function () {
        sock.send(cmd);
    }, 1000);
});
sock.on("error", function (err) {
    Log_1["default"].info("error: ", err);
});
sock.on("close", function () {
    Log_1["default"].info("close");
});
sock.on("message", function (cmd_buf) {
    var cmd = ProtoManager_1["default"].decode_cmd_header(cmd_buf);
    Log_1["default"].info("head: ", cmd);
    Log_1["default"].info("receive:", ProtoManager_1["default"].decode_cmd(proto_type, cmd_buf));
});
//# sourceMappingURL=NetBusCliWs.js.map