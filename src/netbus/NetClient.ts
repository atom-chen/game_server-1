//当前作为客户端，连接到的其他服务器(tcp连接)

import * as TcpSocket from "net"
import ServiceManager from "./ServiceManager";
import Log from "../utils/Log";
import ProtoManager from "./ProtoManager";
let StickPackage = require("stickpackage")

let server_session_map:any = {}
let max_server_load_count:number = 1000; // 一个room服务最大人数

class NetClient {

    static connect_tcp_server(host: string, port: number, is_encrypt: boolean, stype?:number, success_callfunc?: Function) {
        let server_session: any = TcpSocket.connect({
            port: port,
            host: host,
        });

        server_session.is_connected = false;
        server_session.stype = stype;
        server_session.load_count = 0; //当前连接的服务的人数，有人连接就自增
        server_session.on("connect", function () {
            NetClient.on_session_connected(server_session, is_encrypt);
            if (server_session.msgCenter) {
                server_session.msgCenter.onMsgRecv(function (cmd_buf: Buffer) {
                    NetClient.on_recv_cmd_server_return(server_session, cmd_buf)
                });
            }
            if (success_callfunc) {
                success_callfunc(server_session);//这里将所连接的服务的session返回，各个进程自己维护服务session
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
                Log.warn("reconnect:", host, port);
                NetClient.connect_tcp_server(host, port, is_encrypt, stype, success_callfunc);
            }, 1000);
        });

        server_session.on("error", function (err: Error) {
        });

        server_session.on("data", function (data: Buffer) {
            if (!Buffer.isBuffer(data)) {
                NetClient.session_close(server_session);
                return;
            }

            if (server_session.msgCenter){
                server_session.msgCenter.putData(data)
            }
        });
    }

    static on_session_connected(server_session: any, is_encrypt: boolean) {
        Log.info("connect server success! ", server_session.remoteAddress, server_session.remotePort);
        server_session.is_connected = true;
        server_session.is_encrypt = is_encrypt;
        server_session.msgCenter = new StickPackage.msgCenter({ bigEndian: false }) //粘包处理工具
    }

    static on_recv_cmd_server_return(server_session: any, str_or_buf: any) {
        let ret = ServiceManager.on_recv_server_cmd(server_session, str_or_buf);
        if (!ret) {
            // NetClient.session_close(server_session);
        }
    }

    static session_close(server_session: any) {
        if (server_session.end){
            server_session.end();
            server_session.is_connected = false;
            NetClient.clear_server_session(server_session.server_ip_port_key)
        }
    }

    //当前作为客户端，其他服务器断开链接
    static on_session_disconnect(server_session:any) {
        server_session.is_connected = false;
    }

    // 发送数据包
    static send_cmd(server_session: any, stype: number, ctype: number, utag: number, proto_type: number, body?: any) {
        if (!server_session || !server_session.is_connected) {
            return
        }
        let encode_cmd = ProtoManager.encode_cmd(stype, ctype, utag, proto_type, body);
        if (encode_cmd) {
            NetClient.send_encoded_cmd(server_session,encode_cmd);
        }
    }

    // 发送未解包的数据包
    static send_encoded_cmd(server_session: any, encode_cmd: any) {
        if (!server_session || !server_session.is_connected) {
            return;
        }

        if (server_session.is_encrypt) {
            encode_cmd = ProtoManager.encrypt_cmd(encode_cmd);
        }

        if (server_session.is_websocket) {//websocket
            server_session.send(encode_cmd);
        } else {//tcp
            if (server_session.msgCenter) {
              let data = server_session.msgCenter.publish(encode_cmd);
              if (data) {
                  server_session.write(data);
              }
            }
        }
    }

    static save_server_session(server_session:any, ip:string, port:string){
        let server_session_key = ip + ":" + port;
        server_session_map[server_session_key] = server_session;
        server_session.server_ip_port_key = server_session_key;
    }

    static get_server_session(ip_port_key: string) {
        return server_session_map[ip_port_key];
    }

    static clear_server_session(ip_port_key: string){
        if (server_session_map[ip_port_key]){
            delete server_session_map[ip_port_key];
        }
    }

    //没超负载的服务,且用户多的服务
    //超负载就换下一个
    static choose_server(){
        let server_session = null;
        for(let k in server_session_map){
            let session = server_session_map[k];
            if(server_session == null){
                server_session = session;
            }else{
                if (server_session.load_count > session.load_count && server_session.load_count < max_server_load_count ){
                    server_session = session;
                }
            }
        }
        return server_session;
    }
}

export default NetClient;