"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("./ProtoManager"));
var WebSocket = __importStar(require("ws"));
var TcpSocket = __importStar(require("net"));
var Log_1 = __importDefault(require("../utils/Log"));
var NetServerHandle_1 = __importDefault(require("./NetServerHandle"));
var NetServer = /** @class */ (function () {
    function NetServer() {
    }
    //开启webserver
    NetServer.start_ws_server = function (ip, port, is_encrypt, success_callfunc) {
        Log_1["default"].info("start ws server:", ip, port);
        var server = new WebSocket.Server({ host: ip, port: port });
        server.on("connection", function (client_session) {
            NetServerHandle_1["default"].on_session_enter(client_session, true, is_encrypt);
            NetServerHandle_1["default"].ws_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
        });
        server.on("error", function (err) {
        });
        server.on("close", function (err) {
            Log_1["default"].error("WebSocket server listen close!!");
        });
    };
    //开启tcpserver
    NetServer.start_tcp_server = function (ip, port, is_encrypt, success_callfunc) {
        Log_1["default"].info("start tcp server:", ip, port);
        var server = TcpSocket.createServer(function (client_session) {
            NetServerHandle_1["default"].on_session_enter(client_session, false, is_encrypt);
            NetServerHandle_1["default"].tcp_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
        });
        // 监听发生错误的时候调用
        server.on("error", function () {
            Log_1["default"].error("tcp server listen error");
        });
        server.on("close", function () {
            Log_1["default"].error("tcp server listen close");
        });
        server.listen({
            host: ip,
            port: port,
            exclusive: true
        });
    };
    //关闭session连接
    NetServer.session_close = function (session) {
        NetServerHandle_1["default"].session_close(session);
    };
    // 发送数据包
    NetServer.send_cmd = function (session, stype, ctype, utag, proto_type, body) {
        if (!session || !session.is_connected) {
            return;
        }
        var encode_cmd = ProtoManager_1["default"].encode_cmd(stype, ctype, utag, proto_type, body);
        if (encode_cmd) {
            NetServer.send_encoded_cmd(session, encode_cmd);
        }
    };
    // 发送未解包的数据包
    NetServer.send_encoded_cmd = function (session, encode_cmd) {
        if (!session || !session.is_connected) {
            return;
        }
        if (session.is_encrypt) {
            encode_cmd = ProtoManager_1["default"].encrypt_cmd(encode_cmd);
        }
        if (session.is_websocket) { //websocket
            session.send(encode_cmd);
        }
        else { //tcp
            var data = null;
            if (session.msgCenter) {
                data = session.msgCenter.publish(encode_cmd);
            }
            if (data) {
                session.write(data);
            }
        }
    };
    //获取客户端Session
    NetServer.get_client_session = function (session_key) {
        return NetServerHandle_1["default"].get_client_session(session_key);
    };
    NetServer.get_client_session_list = function () {
        return NetServerHandle_1["default"].get_client_session_list();
    };
    NetServer.set_client_session = function (session, session_key) {
        NetServerHandle_1["default"].set_client_session(session, session_key);
    };
    NetServer.delete_client_session = function (session_key) {
        NetServerHandle_1["default"].delete_client_session(session_key);
    };
    return NetServer;
}());
exports["default"] = NetServer;
//# sourceMappingURL=NetServer.js.map