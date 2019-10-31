"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Log = require("../utils/Log");
var net = require("net");
var StickPackage = require("stickpackage");
var ProtoManager_1 = __importDefault(require("../netbus/ProtoManager"));
var Platform_1 = __importDefault(require("../utils/Platform"));
var recvMsgCenter = new StickPackage.msgCenter({ bigEndian: false });
var local = "127.0.0.1";
var remote = "www.hccfun.com";
var hoststr = Platform_1.default.isWin32() ? local : remote;
Log.info("host:", hoststr);
var proto_type = 2;
var sock = net.connect({
    port: 6080,
    host: local,
}, function () {
    console.log('tcp connected to server!');
});
sock.on("connect", function () {
    var msgCenter = new StickPackage.msgCenter({ bigEndian: false });
    console.log("tcp connect success");
    var stype = 2;
    var ctype = 1;
    var utag = 0;
    var body = {
        name: "huangshucheng tcpsocket",
        age: 27,
        email: "827773271@qq.com",
    };
    var cmd1 = ProtoManager_1.default.encode_cmd(stype, ctype, utag, proto_type, body);
    //粘包处理工具
    var cmd_buf = msgCenter.publish(cmd1);
    setInterval(function () {
        sock.write(cmd_buf);
    }, 1000);
});
sock.on("error", function (e) {
    Log.info("error", e);
});
sock.on("close", function () {
    Log.info("close");
});
sock.on("end", function () {
    Log.info("end event");
});
sock.on("data", function (data) {
    recvMsgCenter.putData(data);
});
//处理粘包
recvMsgCenter.onMsgRecv(function (cmd_buf) {
    var cmd = ProtoManager_1.default.decode_cmd_header(cmd_buf);
    var body = ProtoManager_1.default.decode_cmd(proto_type, cmd_buf);
    Log.info("header: ", cmd);
    Log.info("body: ", body);
});
//# sourceMappingURL=NetBusCliTcp_stickPkg.js.map