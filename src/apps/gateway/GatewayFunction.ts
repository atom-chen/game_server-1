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
let robot_session_map:USMap = {}; //机器人客户端session

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

    //保存机器人session
    static save_robot_session(session:any,uid:number){
        robot_session_map[uid] = session;
    }

    //获取机器人session
    static get_robot_session(uid:number){
        return robot_session_map[uid];
    }

    //是否机器人session
    static is_robot_session(session:any){
        for(let key in robot_session_map){
            if (robot_session_map[key] == session){
                return true
            }
        }
        return false;
    }

    //获取机器人session map
    static get_robot_session_map(){
        return robot_session_map;
    }

}

export default GatewayFunction;