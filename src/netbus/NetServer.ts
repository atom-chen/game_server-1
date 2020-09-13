//当前作为服务端，监听其他服务器来连接

import ProtoManager from "./ProtoManager"
import * as WebSocket from "ws"
import * as TcpSocket from "net"
import Log from '../utils/Log';
import NetServerHandle from './NetServerHandle';

class NetServer {

    //开启webserver
    static start_ws_server(ip: string, port: number, is_encrypt: boolean, success_callfunc?: Function) {
        let options: WebSocket.ServerOptions = { host: ip, port: port, };
        const server:WebSocket.Server = new WebSocket.Server(options);
        
        server.on("connection", function(client_session:WebSocket){
            NetServerHandle.on_session_enter(client_session, true, is_encrypt);
            NetServerHandle.ws_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
        });
        
        server.on("listening", function () {
            Log.info("WebSocket server start listen",",ip:" , ip , " ,port:" , port);
        });

        server.on("error", function(err:Error){
            Log.error("WebSocket server listen error");
        });

        server.on("close", function(err:Error){
            Log.error("WebSocket server listen close!!");
        });

    }

    //开启tcpserver
    static start_tcp_server(ip: string, port: number, is_encrypt: boolean, success_callfunc?: Function) {
        let options: TcpSocket.ListenOptions = { port: port, host: ip, exclusive: true, }
        const server = TcpSocket.createServer();
        server.listen(options);
        
        server.on("connection", function (client_session: TcpSocket.Socket) {
            Log.info("tcp client connection:", client_session.address());
            NetServerHandle.on_session_enter(client_session, false, is_encrypt);
            NetServerHandle.tcp_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
        });

        server.on("listening", function() {
            Log.info("tcp server start listen", ",ip:", ip, " ,port:", port);
        });

        server.on("error", function() {
            Log.error("tcp server listen error");
        });

        server.on("close", function() {
            Log.error("tcp server listen close");
        });
    }

    //关闭session连接
    static session_close(session: any){
        NetServerHandle.session_close(session);
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
            if (session.msgCenter){
                data = session.msgCenter.publish(encode_cmd);
            }
            if (data){
                session.write(data);
            }
        }
    }

    //获取客户端Session
    static get_client_session(session_key:number) {
        return NetServerHandle.get_client_session(session_key);
    }

    //获取客户端Session列表
    static get_client_session_list(){
        return NetServerHandle.get_client_session_list();
    }

    //保存客户端session
    static set_client_session(session:any, session_key:number){
        NetServerHandle.set_client_session(session, session_key);
    }

    //删除客户端session
    static delete_client_session(session_key:any){
        NetServerHandle.delete_client_session(session_key);
    }
    
}

export default NetServer;