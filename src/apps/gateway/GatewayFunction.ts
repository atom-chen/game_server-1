import { Cmd } from '../protocol/AuthProto';
import { Stype } from '../protocol/Stype';

interface USMap {
    [uid: number]: any;
}

let LOGIN_OR_REGIST_ERQ_CMD = [
    Cmd.eUnameLoginReq,
    Cmd.eGuestLoginReq,
    Cmd.ePhoneRegistReq,
    Cmd.eUnameRegistReq,
    Cmd.eWeChatLoginReq,
    Cmd.eWeChatSessionLoginReq,
]

let LOGIN_OR_REGIST_ERS_CMD = [
    Cmd.eUnameLoginRes,
    Cmd.eGuestLoginRes,
    Cmd.eUnameRegistRes,
    Cmd.ePhoneRegistRes,
    Cmd.eWeChatLoginRes,
    Cmd.eWeChatSessionLoginRes,
]

let uid_session_map: USMap = {}   //保存已经登录过的玩家 uid-> session
let server_session_map: USMap = {} //当前连接的服务器session

class GatewayFunction {

    //登录请求
    static is_login_req_cmd(stype: number, ctype: number):boolean {
        if (stype != Stype.Auth) {
            return false;
        }
        return (LOGIN_OR_REGIST_ERQ_CMD.indexOf(ctype) > -1);
    }

    //登录返回
    static is_login_res_cmd(stype: number, ctype: number) {
        if (stype != Stype.Auth) {
            return false;
        }
        return (LOGIN_OR_REGIST_ERS_CMD.indexOf(ctype) > -1);
    }

    //返回登录过的玩家的UID
    static get_session_by_uid(uid: number) {
        return uid_session_map[uid];
    }

    //保存登录过的玩家的 uid->session
    static save_session_with_uid(uid: number, session: any, proto_type: number) {
        uid_session_map[uid] = session;
        session.proto_type = proto_type;
    }

    //清理session
    static clear_session_with_uid(uid: number) {
        if (uid_session_map[uid]) {
            uid_session_map[uid] = null;
            delete uid_session_map[uid];
        }
    }

    //保存当前所连接的服务session
    static save_server_session(server_session:any, stype:number){
        server_session_map[stype] = server_session;
    }

    //获取服务session
    static get_server_session(stype:number){
        return server_session_map[stype];
    }
}

export default GatewayFunction;