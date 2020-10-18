"use strict";
//当前作为客户端，连接到的其他服务器(tcp连接)
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var TcpSocket = __importStar(require("net"));
var ServiceManager_1 = __importDefault(require("./ServiceManager"));
var Log_1 = __importDefault(require("../utils/Log"));
var ProtoManager_1 = __importDefault(require("./ProtoManager"));
var util = __importStar(require("util"));
var Stype_1 = __importDefault(require("../apps/protocol/Stype"));
var StickPackage = require("stickpackage");
var NetClient = /** @class */ (function () {
    function NetClient() {
    }
    NetClient.connect_tcp_server = function (host, port, is_encrypt, stype, success_callfunc) {
        var options = { port: port, host: host };
        var server_session = TcpSocket.createConnection(options, function () {
            var stypeName = util.isNullOrUndefined(stype) ? "" : Stype_1["default"].S_NAME[stype];
            Log_1["default"].info("hcc>>已经连接到tcp服务器：", stypeName, host, port);
        });
        server_session.is_connected = false;
        server_session.stype = stype;
        server_session.on("connect", function () {
            NetClient.on_session_connected(server_session, is_encrypt);
            if (server_session.msgCenter) {
                server_session.msgCenter.onMsgRecv(function (cmd_buf) {
                    NetClient.on_recv_cmd_server_return(server_session, cmd_buf);
                });
            }
            if (success_callfunc) {
                success_callfunc(server_session); //这里将所连接的服务的session返回，各个进程自己维护服务session
            }
        });
        server_session.on("close", function () {
            if (server_session.is_connected == true) {
                NetClient.on_session_disconnect(server_session);
            }
            NetClient.session_close(server_session);
            // 重新连接服务器
            setTimeout(function () {
                Log_1["default"].warn("reconnect:", host, port);
                NetClient.connect_tcp_server(host, port, is_encrypt, stype, success_callfunc);
            }, 1000);
        });
        server_session.on("error", function (err) {
        });
        server_session.on("data", function (data) {
            if (!Buffer.isBuffer(data)) {
                NetClient.session_close(server_session);
                return;
            }
            if (server_session.msgCenter) {
                server_session.msgCenter.putData(data);
            }
        });
    };
    NetClient.on_session_connected = function (server_session, is_encrypt) {
        Log_1["default"].info("connect server success! ", server_session.remoteAddress, server_session.remotePort);
        server_session.is_connected = true;
        server_session.is_encrypt = is_encrypt;
        server_session.msgCenter = new StickPackage.msgCenter({ bigEndian: false }); //粘包处理工具
    };
    NetClient.on_recv_cmd_server_return = function (server_session, str_or_buf) {
        ServiceManager_1["default"].on_recv_server_cmd(server_session, str_or_buf);
    };
    NetClient.session_close = function (server_session) {
        if (server_session.end) {
            server_session.end();
            server_session.is_connected = false;
        }
    };
    //当前作为客户端，其他服务器断开链接
    NetClient.on_session_disconnect = function (server_session) {
        server_session.is_connected = false;
        var server_key = server_session.remotePort;
        if (NetClient.server_disconnect_func_array[server_key]) {
            NetClient.server_disconnect_func_array[server_key](server_session);
            delete NetClient.server_disconnect_func_array[server_key];
        }
    };
    //server_key: port
    NetClient.set_server_disconnect_func = function (server_key, func) {
        NetClient.server_disconnect_func_array[server_key] = func;
    };
    // 发送数据包
    NetClient.send_cmd = function (server_session, stype, ctype, utag, proto_type, body) {
        if (!server_session || !server_session.is_connected) {
            return;
        }
        var encode_cmd = ProtoManager_1["default"].encode_cmd(stype, ctype, utag, proto_type, body);
        if (encode_cmd) {
            NetClient.send_encoded_cmd(server_session, encode_cmd);
        }
    };
    // 发送未解包的数据包
    NetClient.send_encoded_cmd = function (server_session, encode_cmd) {
        if (!server_session || !server_session.is_connected) {
            return;
        }
        if (server_session.is_encrypt) {
            encode_cmd = ProtoManager_1["default"].encrypt_cmd(encode_cmd);
        }
        if (server_session.is_websocket) { //websocket
            server_session.send(encode_cmd);
        }
        else { //tcp
            if (server_session.msgCenter) {
                var data = server_session.msgCenter.publish(encode_cmd);
                if (data) {
                    server_session.write(data);
                }
            }
        }
    };
    NetClient.server_disconnect_func_array = {};
    return NetClient;
}());
exports["default"] = NetClient;
//# sourceMappingURL=NetClient.js.map