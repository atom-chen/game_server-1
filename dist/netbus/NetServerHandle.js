"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../utils/Log"));
var ArrayUtil_1 = __importDefault(require("../utils/ArrayUtil"));
var ServiceManager_1 = __importDefault(require("./ServiceManager"));
var StickPackage = require("stickpackage");
var client_session_list = {}; //客户端session
var global_seesion_key = 1; //客户端session key
var NetServerHandle = /** @class */ (function () {
    function NetServerHandle() {
    }
    //有客户端session连接
    NetServerHandle.on_session_enter = function (session, is_websocket, is_encrypt) {
        var tmp_session_key = "";
        if (is_websocket) {
            tmp_session_key = session._socket.remoteAddress + ":" + session._socket.remotePort;
            Log_1["default"].info("websocket client session enter", tmp_session_key);
        }
        else {
            tmp_session_key = session.remoteAddress + ":" + session.remotePort;
            Log_1["default"].info("tcpsocket client session enter", tmp_session_key);
        }
        session.uid = 0; // 用户的UID
        session.is_connected = true; // 是否连接成功
        session.is_robot = false; // 是否机器人
        session.is_websocket = is_websocket; // 是否websocket
        session.is_encrypt = is_encrypt; // 是否数据加密
        session.session_key = global_seesion_key; // 临时session_key
        if (!is_websocket) {
            var option = { bigEndian: false }; //小端
            session.msgCenter = new StickPackage.msgCenter(option); //粘包处理工具
        }
        //加入到session 列表
        client_session_list[global_seesion_key] = session;
        global_seesion_key++;
        Log_1["default"].warn("client session enter, client count: ", ArrayUtil_1["default"].GetArrayLen(client_session_list));
    };
    //websocket 客户端session事件
    NetServerHandle.ws_add_client_session_event = function (session) {
        session.on("close", function () {
            NetServerHandle.on_session_exit(session);
            NetServerHandle.session_close(session);
        });
        session.on("error", function (err) {
        });
        session.on("message", function (data) {
            if (!Buffer.isBuffer(data)) {
                NetServerHandle.session_close(session);
                return;
            }
            NetServerHandle.on_session_recv_cmd(session, data);
        });
    };
    //tcp 客户端session事件
    NetServerHandle.tcp_add_client_session_event = function (session) {
        session.on("close", function () {
            NetServerHandle.on_session_exit(session);
            NetServerHandle.session_close(session);
        });
        session.on("error", function (err) {
        });
        session.on("data", function (data) {
            if (!Buffer.isBuffer(data)) {
                NetServerHandle.session_close(session);
                return;
            }
            if (session.msgCenter) {
                session.msgCenter.putData(data);
            }
        });
        if (session.msgCenter) {
            session.msgCenter.onMsgRecv(function (cmd_buf) {
                NetServerHandle.on_session_recv_cmd(session, cmd_buf);
            });
        }
    };
    //接收客户端数据
    NetServerHandle.on_session_recv_cmd = function (session, str_or_buf) {
        ServiceManager_1["default"].on_recv_client_cmd(session, str_or_buf);
    };
    // 有客户端session退出
    NetServerHandle.on_session_exit = function (session) {
        session.is_connected = false;
        ServiceManager_1["default"].on_client_lost_connect(session);
        if (client_session_list[session.session_key]) {
            delete client_session_list[session.session_key];
            session.session_key = null;
        }
        Log_1["default"].warn("client session exit, client count: ", ArrayUtil_1["default"].GetArrayLen(client_session_list));
    };
    // 关闭session
    NetServerHandle.session_close = function (session) {
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
    //获取客户端Session
    NetServerHandle.get_client_session = function (session_key) {
        return client_session_list[session_key];
    };
    //获取客户端session列表
    NetServerHandle.get_client_session_list = function () {
        return client_session_list;
    };
    //保存客户端session
    NetServerHandle.set_client_session = function (session, session_key) {
        client_session_list[session_key] = session;
    };
    //删除客户端session
    NetServerHandle.delete_client_session = function (session_key) {
        if (client_session_list[session_key]) {
            client_session_list[session_key] = null;
            delete client_session_list[session_key];
        }
    };
    return NetServerHandle;
}());
exports["default"] = NetServerHandle;
//# sourceMappingURL=NetServerHandle.js.map