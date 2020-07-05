import NetBus from "../../netbus/NetBus";
import { Stype } from '../protocol/Stype';
import NetClient from '../../netbus/NetClient';

let server_session_map:any = {} //当前连接的服务器session

class AuthSendMsg {

    //保存当前所连接的服务session
    static save_server_session(server_session: any, stype: number) {
        server_session_map[stype] = server_session;
    }

    //获取服务session
    static get_server_session(stype: number) {
        return server_session_map[stype];
    }

    //当前作为服务端，发给客户端,session 为客户端session
    public static send(session:any, ctype:number, utag:number, proto_type:number, body:any){
        NetBus.send_cmd(session, Stype.Auth, ctype, utag, proto_type, body)
    }

    //当前作为客户端，发给data_server, server_session已经保存
    public static send_data_server(ctype:number, utag:number, proto_type:number, body:any){
        let server_session = AuthSendMsg.get_server_session(Stype.DataBase);
        NetClient.send_cmd(server_session, Stype.DataBase, ctype, utag, proto_type, body);
    }
}

export default AuthSendMsg;