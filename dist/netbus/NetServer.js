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
var TcpPkg_1 = __importDefault(require("./TcpPkg"));
var ProtoManager_1 = __importDefault(require("./ProtoManager"));
var ServiceManager_1 = __importDefault(require("./ServiceManager"));
var WebSocket = __importStar(require("ws"));
var TcpSocket = __importStar(require("net"));
var ArrayUtil_1 = __importDefault(require("../utils/ArrayUtil"));
var Log_1 = __importDefault(require("../utils/Log"));
var StickPackage = require("stickpackage");
var client_session_list = {}; //客户端session
var global_seesion_key = 1; //客户端session key
var IS_USE_STICKPACKAGE = true; //是否使用stickpackage处理粘包
var NetServer = /** @class */ (function () {
    function NetServer() {
    }
    //开启webserver
    NetServer.start_ws_server = function (ip, port, is_encrypt) {
        Log_1["default"].info("start ws server:", ip, port);
        var server = new WebSocket.Server({ host: ip, port: port });
        server.on("connection", function (client_session) {
            NetServer.on_session_enter(client_session, true, is_encrypt);
            NetServer.ws_add_client_session_event(client_session);
        });
        server.on("error", function (err) {
        });
        server.on("close", function (err) {
            Log_1["default"].error("WebSocket server listen close!!");
        });
    };
    //开启tcpserver
    NetServer.start_tcp_server = function (ip, port, is_encrypt) {
        Log_1["default"].info("start tcp server:", ip, port);
        var server = TcpSocket.createServer(function (client_session) {
            NetServer.on_session_enter(client_session, false, is_encrypt);
            NetServer.tcp_add_client_session_event(client_session);
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
    // 有客户端的session接入进来
    NetServer.on_session_enter = function (session, is_websocket, is_encrypt) {
        if (is_websocket) {
            Log_1["default"].info("websocket client session enter", session._socket.remoteAddress, session._socket.remotePort);
        }
        else {
            Log_1["default"].info("tcpsocket client session enter", session.remoteAddress, session.remotePort);
        }
        session.uid = 0; // 用户的UID
        session.last_pkg = null; // 表示存储的上一次没有处理完的TCP包;
        session.is_connected = true; // 是否连接成功
        session.is_websocket = is_websocket; // 是否websocket
        session.is_encrypt = is_encrypt; // 是否数据加密
        session.is_robot = false; // 是否机器人
        if (!is_websocket) {
            var option = { bigEndian: false };
            session.msgCenter = new StickPackage.msgCenter(option); //粘包处理工具
        }
        //加入到serssion 列表
        client_session_list[global_seesion_key] = session;
        session.session_key = global_seesion_key;
        global_seesion_key++;
        Log_1["default"].warn("client session enter, client count: ", ArrayUtil_1["default"].GetArrayLen(client_session_list));
    };
    //websocket 客户端session事件
    NetServer.ws_add_client_session_event = function (session) {
        session.on("close", function () {
            NetServer.on_session_exit(session);
            NetServer.session_close(session);
        });
        session.on("error", function (err) {
        });
        session.on("message", function (data) {
            if (!Buffer.isBuffer(data)) {
                NetServer.session_close(session);
                return;
            }
            NetServer.on_session_recv_cmd(session, data);
        });
    };
    //tcp 客户端session事件
    NetServer.tcp_add_client_session_event = function (session) {
        session.on("close", function () {
            NetServer.on_session_exit(session);
            NetServer.session_close(session);
        });
        session.on("error", function (err) {
        });
        session.on("data", function (data) {
            if (!Buffer.isBuffer(data)) {
                NetServer.session_close(session);
                return;
            }
            if (IS_USE_STICKPACKAGE == true) {
                if (session.msgCenter) {
                    session.msgCenter.putData(data);
                }
            }
            else {
                //TODO 数据包不对，会一直堆积
                var last_pkg = NetServer.handle_package_data(session.last_pkg, data, function (cmd_buf) {
                    NetServer.on_session_recv_cmd(session, cmd_buf);
                });
                session.last_pkg = last_pkg;
            }
        });
        if (session.msgCenter) {
            session.msgCenter.onMsgRecv(function (cmd_buf) {
                NetServer.on_session_recv_cmd(session, cmd_buf);
            });
        }
    };
    //接收客户端数据
    NetServer.on_session_recv_cmd = function (session, str_or_buf) {
        var ret = ServiceManager_1["default"].on_recv_client_cmd(session, str_or_buf);
        if (!ret) {
            // NetServer.session_close(session);
        }
    };
    // 有客户端session退出
    NetServer.on_session_exit = function (session) {
        session.is_connected = false;
        ServiceManager_1["default"].on_client_lost_connect(session);
        session.last_pkg = null;
        if (client_session_list[session.session_key]) {
            delete client_session_list[session.session_key];
            session.session_key = null;
        }
        Log_1["default"].warn("client session exit, client count: ", ArrayUtil_1["default"].GetArrayLen(client_session_list));
    };
    // 关闭session
    NetServer.session_close = function (session) {
        if (!session.is_websocket) {
            if (session.end) {
                session.end();
            }
        }
        else {
            if (session.close) {
                session.close();
            }
        }
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
            if (IS_USE_STICKPACKAGE == true) {
                if (session.msgCenter) {
                    data = session.msgCenter.publish(encode_cmd);
                }
            }
            else {
                data = TcpPkg_1["default"].package_data(encode_cmd);
            }
            if (data) {
                session.write(data);
            }
        }
    };
    //tcp粘包处理
    NetServer.handle_package_data = function (last_package, recv_data, cmd_callback) {
        if (!recv_data) {
            return null;
        }
        // Log.info("handle_package_data111")
        var last_pkg = last_package;
        var data = recv_data;
        if (last_pkg != null) { //上一次剩余没有处理完的半包;
            last_pkg = Buffer.concat([last_pkg, data], last_pkg.length + data.length);
        }
        else {
            last_pkg = data;
        }
        // Log.info("handle_package_data222")
        var pkg_len = TcpPkg_1["default"].read_pkg_size(last_pkg, 0);
        if (pkg_len <= 2 || pkg_len <= 0) {
            return null;
        }
        var offset = 0;
        var HEAD_LEN = 2; //2个长度信息
        // Log.info("handle_package_data333,offset: "+ offset , "pkg_len: "+ pkg_len ,"last_pkg_len: " + last_pkg.length)
        while (offset + pkg_len <= last_pkg.length) { //判断是否有完整的包;
            // 根据长度信息来读取数据
            var cmd_buf = null;
            // 收到了一个完整的数据包
            cmd_buf = Buffer.allocUnsafe(pkg_len - HEAD_LEN);
            last_pkg.copy(cmd_buf, 0, offset + HEAD_LEN, offset + pkg_len);
            if (cmd_callback) {
                // Log.info("handle_package_data9999")
                cmd_callback(cmd_buf);
            }
            // Log.info("handle_package_data444")
            offset += pkg_len;
            if (offset >= last_pkg.length) { //正好包处理完了
                break;
            }
            pkg_len = TcpPkg_1["default"].read_pkg_size(last_pkg, offset);
            if (pkg_len < 0) {
                break;
            }
        }
        // 能处理的数据包已经处理完成了,保存 0.几个包的数据
        if (offset >= last_pkg.length) {
            last_pkg = null;
        }
        else {
            var buf = Buffer.allocUnsafe(last_pkg.length - offset);
            last_pkg.copy(buf, 0, offset, last_pkg.length);
            last_pkg = buf;
        }
        // Log.info("handle_package_data555")
        return last_pkg;
    };
    //获取客户端Session
    NetServer.get_client_session = function (session_key) {
        return client_session_list[session_key];
    };
    NetServer.get_client_session_list = function () {
        return client_session_list;
    };
    NetServer.save_client_session = function (session, session_key) {
        client_session_list[session_key] = session;
    };
    NetServer.delete_client_session = function (session_key) {
        if (client_session_list[session_key]) {
            client_session_list[session_key] = null;
            delete client_session_list[session_key];
        }
    };
    return NetServer;
}());
exports["default"] = NetServer;
//# sourceMappingURL=NetServer.js.map