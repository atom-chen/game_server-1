"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Stype_1 = require("../apps/protocol/Stype");
var ProtoCmd_1 = __importDefault(require("../apps/protocol/ProtoCmd"));
var Log_1 = __importDefault(require("../utils/Log"));
var stype = Stype_1.Stype.Auth;
var ctype = 1; //eUnameLoginReq
var stypeName = ProtoCmd_1["default"].getProtoName(stype);
var cmdName = ProtoCmd_1["default"].getCmdName(stype, ctype);
var protofile = ProtoCmd_1["default"].getProtoFileObj(stype);
var msgType = protofile[stypeName][cmdName];
var body = {
    uname: "hcccccc",
    upwd: "123456"
};
var error = msgType.verify(body);
if (error) {
    Log_1["default"].error(error);
}
var message = msgType.create(body);
var emcode_msg = msgType.encode(message).finish();
var decodemsg = msgType.decode(emcode_msg);
Log_1["default"].info(decodemsg);
//# sourceMappingURL=protofile_test.js.map