//协议发送

import NetServer from "../../netbus/NetServer";
import Stype from '../protocol/Stype';

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
        NetServer.send_cmd(session, Stype.S_TYPE.Auth, ctype, utag, proto_type, body)
    }
}

export default AuthSendMsg;