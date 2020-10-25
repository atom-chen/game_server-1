//协议发送

import NetServer from "../../netengine/NetServer";
import Stype from '../protocol/Stype';

class AuthSendMsg {
    //当前作为服务端，发给客户端,session 为客户端session
    public static send(session:any, ctype:number, utag:number, proto_type:number, body:any){
        NetServer.send_cmd(session, Stype.S_TYPE.Auth, ctype, utag, proto_type, body)
    }
}

export default AuthSendMsg;