import TcpPkg from "./TcpPkg"
import ProtoManager from "./ProtoManager"
import ServiceManager from "./ServiceManager"
import * as WebSocket from "ws"
import * as TcpSocket from "net"
import ArrayUtil from '../utils/ArrayUtil';
import Log from '../utils/Log';

let StickPackage    = require("stickpackage")

let client_session_list:any         = {}; 	//客户端session
let global_seesion_key:number 	    = 1; 	//客户端session key
let IS_USE_STICKPACKAGE:boolean     = true; //是否使用stickpackage处理粘包

class NetServer {
    //开启webserver
    static start_ws_server(ip:string, port:number, is_encrypt:boolean) {
        Log.info("start ws server:", ip, port);
        let server:WebSocket.Server = new WebSocket.Server({ host: ip, port: port,});
        server.on("connection", function(client_session:WebSocket){
            NetServer.on_session_enter(client_session, true, is_encrypt);
            NetServer.ws_add_client_session_event(client_session);
        });

        server.on("error", function(err:Error){
        });

        server.on("close", function(err:Error){
            Log.error("WebSocket server listen close!!");
        });
    }
    //开启tcpserver
    static start_tcp_server(ip:string, port:number, is_encrypt:boolean) {
        Log.info("start tcp server:", ip, port);
        let server = TcpSocket.createServer(function(client_session:TcpSocket.Socket) { 
            NetServer.on_session_enter(client_session, false, is_encrypt);
            NetServer.tcp_add_client_session_event(client_session);
        });
        // 监听发生错误的时候调用
        server.on("error", function() {
            Log.error("tcp server listen error");
        });

        server.on("close", function() {
            Log.error("tcp server listen close");
        });

        server.listen({
            host: ip,
            port: port,
            exclusive: true,
        });
    }
    // 有客户端的session接入进来
    static on_session_enter(session:any, is_websocket:boolean, is_encrypt:boolean) {
        if (is_websocket) {
            Log.info("websocket client session enter", session._socket.remoteAddress, session._socket.remotePort);
        }
        else {
            Log.info("tcpsocket client session enter", session.remoteAddress, session.remotePort);	
        }
        
        session.uid 			= 0; 					// 用户的UID
        session.last_pkg 		= null; 				// 表示存储的上一次没有处理完的TCP包;
        session.is_connected 	= true; 				// 是否连接成功
        session.is_websocket 	= is_websocket; 	    // 是否websocket
        session.is_encrypt 		= is_encrypt; 			// 是否数据加密
        session.is_robot        = false;                // 是否机器人

        if(!is_websocket){
            let option = {bigEndian:false}
            session.msgCenter = new StickPackage.msgCenter(option) //粘包处理工具
        }
        //加入到serssion 列表
        client_session_list[global_seesion_key] = session;
        session.session_key = global_seesion_key;
        global_seesion_key ++;
        Log.warn("client session enter, client count: ", ArrayUtil.GetArrayLen(client_session_list))
    }

    //websocket 客户端session事件
    static ws_add_client_session_event(session:WebSocket) {
        session.on("close", function() {
            NetServer.on_session_exit(session);
            NetServer.session_close(session);
        });

        session.on("error", function(err:Error) {
        });

        session.on("message", function(data:Buffer) {
            if (!Buffer.isBuffer(data)) {
                NetServer.session_close(session);
                return;
            }
            NetServer.on_session_recv_cmd(session, data);
        });
    }

    //tcp 客户端session事件
    static tcp_add_client_session_event(session:any) {
        session.on("close", function() {
            NetServer.on_session_exit(session);
            NetServer.session_close(session);
        });

        session.on("error", function(err:Error) {
        });

        session.on("data", function(data:Buffer) {
            if (!Buffer.isBuffer(data)) {
                NetServer.session_close(session);
                return;
            }
            if(IS_USE_STICKPACKAGE == true){
                if(session.msgCenter){
                    session.msgCenter.putData(data)
                }
            }else{
                //TODO 数据包不对，会一直堆积
                let last_pkg = NetServer.handle_package_data(session.last_pkg, data, function(cmd_buf:Buffer){
                    NetServer.on_session_recv_cmd(session, cmd_buf);
                })
                session.last_pkg = last_pkg;
            }
        });

        if (session.msgCenter){
            session.msgCenter.onMsgRecv(function(cmd_buf:Buffer){
                NetServer.on_session_recv_cmd(session,cmd_buf)
            });
        }
    }

    //接收客户端数据
    static on_session_recv_cmd(session:any, str_or_buf:any) {
        let ret = ServiceManager.on_recv_client_cmd(session, str_or_buf);
        if(!ret) {
            // NetServer.session_close(session);
        }
    }

    // 有客户端session退出
    static on_session_exit(session:any) {
        session.is_connected = false;
        ServiceManager.on_client_lost_connect(session);
        session.last_pkg = null; 
        if (client_session_list[session.session_key]) {
            delete client_session_list[session.session_key];
            session.session_key = null;
        }
        Log.warn("client session exit, client count: " , ArrayUtil.GetArrayLen(client_session_list))
    }

    // 关闭session
    static session_close(session:any) {
        if (!session.is_websocket) {
            if (session.end){
                session.end();
            }
        }
        else {
            if (session.close){
                session.close();
            }
        }
    }

    // 发送数据包
    static send_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, body?:any){
        if (!session || !session.is_connected){
            return
        }
        let encode_cmd = ProtoManager.encode_cmd(stype, ctype, utag, proto_type, body);
        if (encode_cmd) {
            NetServer.send_encoded_cmd(session,encode_cmd)
        }
    }

    // 发送未解包的数据包
    static send_encoded_cmd(session:any, encode_cmd:any){
        if (!session || !session.is_connected) {
            return;
        }

        if(session.is_encrypt) {
            encode_cmd = ProtoManager.encrypt_cmd(encode_cmd);	
        }

        if (session.is_websocket) {//websocket
            session.send(encode_cmd);
        }else {//tcp
            let data = null;
            if (IS_USE_STICKPACKAGE == true){
                if (session.msgCenter){
                    data = session.msgCenter.publish(encode_cmd);
                }
            }else{
                data = TcpPkg.package_data(encode_cmd);
            }
            if (data){
                session.write(data);
            }
        }
    }

    //tcp粘包处理
    static handle_package_data(last_package:Buffer, recv_data:Buffer, cmd_callback:Function){
        if(!recv_data){
            return null;
        }
        // Log.info("handle_package_data111")
        let last_pkg:any = last_package;
        let data 	 = recv_data;
        if (last_pkg != null) { //上一次剩余没有处理完的半包;
            last_pkg = Buffer.concat([last_pkg, data], last_pkg.length + data.length);
        }
        else {
            last_pkg = data
        }
        // Log.info("handle_package_data222")
        let pkg_len = TcpPkg.read_pkg_size(last_pkg, 0);
        if (pkg_len <= 2 || pkg_len <= 0) {
            return null;
        }
        let offset      = 0;
        let HEAD_LEN    = 2; //2个长度信息
        // Log.info("handle_package_data333,offset: "+ offset , "pkg_len: "+ pkg_len ,"last_pkg_len: " + last_pkg.length)
        while(offset + pkg_len <= last_pkg.length) { //判断是否有完整的包;
            // 根据长度信息来读取数据
            let cmd_buf = null; 
            // 收到了一个完整的数据包
            cmd_buf = Buffer.allocUnsafe(pkg_len - HEAD_LEN); 
            last_pkg.copy(cmd_buf, 0, offset + HEAD_LEN, offset + pkg_len);	
            if (cmd_callback){
                // Log.info("handle_package_data9999")
                cmd_callback(cmd_buf)
            }
            // Log.info("handle_package_data444")
            offset += pkg_len;
            if (offset >= last_pkg.length) { //正好包处理完了
                break;
            }

            pkg_len = TcpPkg.read_pkg_size(last_pkg, offset);
            if (pkg_len < 0) {
                break;
            }
        }

        // 能处理的数据包已经处理完成了,保存 0.几个包的数据
        if (offset >= last_pkg.length) {
            last_pkg = null;
        }
        else {
            let buf = Buffer.allocUnsafe(last_pkg.length - offset);
            last_pkg.copy(buf, 0, offset, last_pkg.length);
            last_pkg = buf;
        }

        // Log.info("handle_package_data555")
        return last_pkg
    }

    //获取客户端Session
    static get_client_session(session_key:number) {
        return client_session_list[session_key];
    }

    static get_client_session_list(){
        return client_session_list;
    }

    static save_client_session(session:any, session_key:number){
        client_session_list[session_key] = session;
    }

    static delete_client_session(session_key:any){
        if (client_session_list[session_key]){
            client_session_list[session_key] = null;
            delete client_session_list[session_key];
        }
    }
}

export default NetServer;