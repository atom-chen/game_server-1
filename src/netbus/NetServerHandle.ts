import * as WebSocket from "ws"
import Log from "../utils/Log";
import ArrayUtil from "../utils/ArrayUtil";
import ServiceManager from "./ServiceManager";

let StickPackage = require("stickpackage")

let client_session_list: any = {}; 	//客户端session
let global_seesion_key: number = 1; 	//客户端session key

class NetServerHandle {
    
    //有客户端session连接
    public static on_session_enter(session: any, is_websocket: boolean, is_encrypt: boolean) {
        if (is_websocket) {
            Log.info("websocket client session enter", session._socket.remoteAddress, session._socket.remotePort);
        }
        else {
            Log.info("tcpsocket client session enter", session.remoteAddress, session.remotePort);
        }

        session.uid = 0; 					        // 用户的UID
        session.is_connected = true; 				// 是否连接成功
        session.is_websocket = is_websocket; 	    // 是否websocket
        session.is_encrypt = is_encrypt; 			// 是否数据加密
        session.is_robot = false;                   // 是否机器人

        if (!is_websocket) {
            let option = { bigEndian: false }
            session.msgCenter = new StickPackage.msgCenter(option) //粘包处理工具
        }
        //加入到serssion 列表
        client_session_list[global_seesion_key] = session;
        session.session_key = global_seesion_key;
        global_seesion_key++;
        Log.warn("client session enter, client count: ", ArrayUtil.GetArrayLen(client_session_list))
    }

    //websocket 客户端session事件
    public static ws_add_client_session_event(session: WebSocket) {
        session.on("close", function () {
            NetServerHandle.on_session_exit(session);
            NetServerHandle.session_close(session);
        });

        session.on("error", function (err: Error) {
        });

        session.on("message", function (data: Buffer) {
            if (!Buffer.isBuffer(data)) {
                NetServerHandle.session_close(session);
                return;
            }
            NetServerHandle.on_session_recv_cmd(session, data);
        });
    }

    //tcp 客户端session事件
    static tcp_add_client_session_event(session: any) {
        session.on("close", function () {
            NetServerHandle.on_session_exit(session);
            NetServerHandle.session_close(session);
        });

        session.on("error", function (err: Error) {
        });

        session.on("data", function (data: Buffer) {
            if (!Buffer.isBuffer(data)) {
                NetServerHandle.session_close(session);
                return;
            }
            if (session.msgCenter) {
                session.msgCenter.putData(data)
            }
        });

        if (session.msgCenter) {
            session.msgCenter.onMsgRecv(function (cmd_buf: Buffer) {
                NetServerHandle.on_session_recv_cmd(session, cmd_buf)
            });
        }
    }

    //接收客户端数据
    static on_session_recv_cmd(session: any, str_or_buf: any) {
        ServiceManager.on_recv_client_cmd(session, str_or_buf);
    }

    // 有客户端session退出
    static on_session_exit(session: any) {
        session.is_connected = false;
        ServiceManager.on_client_lost_connect(session);
        session.last_pkg = null;
        if (client_session_list[session.session_key]) {
            delete client_session_list[session.session_key];
            session.session_key = null;
        }
        Log.warn("client session exit, client count: ", ArrayUtil.GetArrayLen(client_session_list))
    }

    // 关闭session
    static session_close(session: any) {
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
    }

    //获取客户端Session
    static get_client_session(session_key: number) {
        return client_session_list[session_key];
    }

    //获取客户端session列表
    static get_client_session_list() {
        return client_session_list;
    }

    //保存客户端session
    static set_client_session(session: any, session_key: number) {
        client_session_list[session_key] = session;
    }

    //删除客户端session
    static delete_client_session(session_key: any) {
        if (client_session_list[session_key]) {
            client_session_list[session_key] = null;
            delete client_session_list[session_key];
        }
    }
}

export default NetServerHandle;