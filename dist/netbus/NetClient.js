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
var StickPackage = require("stickpackage");
var server_session_map = {};
var max_server_load_count = 1000; // 一个room服务最大人数
var NetClient = /** @class */ (function () {
    function NetClient() {
    }
    NetClient.connect_tcp_server = function (host, port, is_encrypt, stype, success_callfunc) {
        var server_session = TcpSocket.connect({
            port: port,
            host: host
        });
        server_session.is_connected = false;
        server_session.stype = stype;
        server_session.load_count = 0; //当前连接的服务的人数，有人连接就自增
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
            NetClient.save_server_session(server_session, host, String(port));
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
        var ret = ServiceManager_1["default"].on_recv_server_cmd(server_session, str_or_buf);
        if (!ret) {
            // NetClient.session_close(server_session);
        }
    };
    NetClient.session_close = function (server_session) {
        if (server_session.end) {
            server_session.end();
            server_session.is_connected = false;
            NetClient.clear_server_session(server_session.server_ip_port_key);
        }
    };
    //当前作为客户端，其他服务器断开链接
    NetClient.on_session_disconnect = function (server_session) {
        server_session.is_connected = false;
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
    NetClient.save_server_session = function (server_session, ip, port) {
        var server_session_key = ip + ":" + port;
        server_session_map[server_session_key] = server_session;
        server_session.server_ip_port_key = server_session_key;
    };
    NetClient.get_server_session = function (ip_port_key) {
        return server_session_map[ip_port_key];
    };
    NetClient.clear_server_session = function (ip_port_key) {
        if (server_session_map[ip_port_key]) {
            delete server_session_map[ip_port_key];
        }
    };
    //没超负载的服务,且用户多的服务
    //超负载就换下一个
    NetClient.choose_server = function () {
        var server_session = null;
        for (var k in server_session_map) {
            var session = server_session_map[k];
            if (server_session == null) {
                server_session = session;
            }
            else {
                if (server_session.load_count > session.load_count && server_session.load_count < max_server_load_count) {
                    server_session = session;
                }
            }
        }
        return server_session;
    };
    return NetClient;
}());
exports["default"] = NetClient;
//# sourceMappingURL=NetClient.js.map