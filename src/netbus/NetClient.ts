//当前作为客户端，连接到的其他服务器(tcp连接)

import * as TcpSocket from "net"
import ServiceManager from "./ServiceManager";
import Log from "../utils/Log";
import ProtoManager from "./ProtoManager";
import * as util from 'util';
import Stype from '../apps/protocol/Stype';
let StickPackage = require("stickpackage")

let server_session_map:any = {}

class NetClient {

    static connect_tcp_server(host: string, port: number, is_encrypt: boolean, stype?:number, success_callfunc?: Function) {
        let options: TcpSocket.NetConnectOpts = {port: port, host: host,};
        let server_session: any = TcpSocket.createConnection(options, function() {
            let stypeName = util.isNullOrUndefined(stype) ? "" : Stype.S_NAME[stype];
            Log.info("hcc>>已经连接到tcp服务器：", stypeName , host, port );
        });

        server_session.is_connected = false;
        server_session.stype = stype;

        server_session.on("connect", function () {
            NetClient.on_session_connected(server_session, is_encrypt);
            if (server_session.msgCenter) {
                server_session.msgCenter.onMsgRecv(function (cmd_buf: Buffer) {
                    NetClient.on_recv_cmd_server_return(server_session, cmd_buf)
                });
            }
            
            // let server_session_key = host + ":" + String(port);
            // NetClient.save_server_session(server_session, server_session_key);

            if (success_callfunc) {
                success_callfunc(server_session);//这里将所连接的服务的session返回，各个进程自己维护服务session
            }
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
        ServiceManager.on_recv_server_cmd(server_session, str_or_buf);
    }

    static session_close(server_session: any) {
        if (server_session.end){
            server_session.end();
            server_session.is_connected = false;
            // NetClient.clear_server_session(server_session.server_ip_port_key)
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

    // static save_server_session(server_session:any, session_key:string){
    //     server_session_map[session_key] = server_session;
    //     server_session.session_key = session_key;
    // }

    // static get_server_session(session_key: string) {
    //     return server_session_map[session_key];
    // }

    // static clear_server_session(session_key: string){
    //     if (server_session_map[session_key]){
    //         delete server_session_map[session_key];
    //     }
    // }
}

export default NetClient;