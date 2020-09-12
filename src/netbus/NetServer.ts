import TcpPkg from "./TcpPkg"
import ProtoManager from "./ProtoManager"
import * as WebSocket from "ws"
import * as TcpSocket from "net"
import Log from '../utils/Log';
import NetServerHandle from './NetServerHandle';

class NetServer {
    //开启webserver
    static start_ws_server(ip: string, port: number, is_encrypt: boolean, success_callfunc?: Function) {
        Log.info("start ws server:", ip, port);
        let server:WebSocket.Server = new WebSocket.Server({ host: ip, port: port,});
        server.on("connection", function(client_session:WebSocket){
            NetServerHandle.on_session_enter(client_session, true, is_encrypt);
            NetServerHandle.ws_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
        });

        server.on("error", function(err:Error){
        });

        server.on("close", function(err:Error){
            Log.error("WebSocket server listen close!!");
        });
    }

    //开启tcpserver
    static start_tcp_server(ip: string, port: number, is_encrypt: boolean, success_callfunc?: Function) {
        Log.info("start tcp server:", ip, port);
        let server = TcpSocket.createServer(function(client_session:TcpSocket.Socket) { 
            NetServerHandle.on_session_enter(client_session, false, is_encrypt);
            NetServerHandle.tcp_add_client_session_event(client_session);
            if (success_callfunc) {
                success_callfunc(client_session);
            }
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

    static get_client_session_list(){
        return NetServerHandle.get_client_session_list();
    }

    static set_client_session(session:any, session_key:number){
        NetServerHandle.set_client_session(session, session_key);
    }

    static delete_client_session(session_key:any){
        NetServerHandle.delete_client_session(session_key);
    }
}

export default NetServer;