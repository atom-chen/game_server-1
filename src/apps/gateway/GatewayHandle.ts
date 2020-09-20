import Stype from '../protocol/Stype';
import AuthProto from '../protocol/protofile/AuthProto';

interface USMap {
    [uid: number]: any;
}

let LOGIN_OR_REGIST_ERQ_CMD = {
    [AuthProto.XY_ID.REQ_UNAMELOGIN] : true,
    [AuthProto.XY_ID.REQ_GUESTLOGIN] : true,
    [AuthProto.XY_ID.REQ_UNAMEREGIST] : true,
    [AuthProto.XY_ID.REQ_WECHATLOGIN] : true,
    [AuthProto.XY_ID.REQ_WECHATSESSIONLOGIN] : true,
}

let LOGIN_OR_REGIST_ERS_CMD = {
    [AuthProto.XY_ID.RES_UNAMELOGIN]: true,
    [AuthProto.XY_ID.RES_GUESTLOGIN]: true,
    [AuthProto.XY_ID.RES_UNAMEREGIST]: true,
    [AuthProto.XY_ID.RES_WECHATLOGIN]: true,
    [AuthProto.XY_ID.RES_WECHATSESSIONLOGIN]: true,
}

let uid_session_map: USMap = {}   //保存已经登录过的玩家 uid-> session
let server_session_map: USMap = {} //当前连接的服务器session

class GatewayFunction {

    //是否登录请求
    static is_login_req_cmd(stype: number, ctype: number):boolean {
        if (stype != Stype.S_TYPE.Auth) {
            return false;
        }
        return LOGIN_OR_REGIST_ERQ_CMD[ctype] === true;
    }

    //是否登录返回
    static is_login_res_cmd(stype: number, ctype: number) {
        if (stype != Stype.S_TYPE.Auth) {
            return false;
        }
        return LOGIN_OR_REGIST_ERS_CMD[ctype] === true;
    }

    /////////////////////////////
    //客户端session
    /////////////////////////////
    //保存登录过的玩家的 uid->session
    static save_client_session_with_uid(uid: number, session: any, proto_type: number) {
        uid_session_map[uid] = session;
        session.proto_type = proto_type;
    }

    //返回登录过的玩家的UID
    static get_client_session_by_uid(uid: number) {
        return uid_session_map[uid];
    }

    //清理session
    static clear_client_session_with_uid(uid: number) {
        if (uid_session_map[uid]) {
            delete uid_session_map[uid];
        }
    }

    /////////////////////////////
    //服务session
    /////////////////////////////
    //保存当前所连接的服务session
    static save_server_session(server_session:any, stype:number){
        server_session_map[stype] = server_session;
    }

    //获取服务session
    static get_server_session(stype:number){
        return server_session_map[stype];
    }
    
    //删除服务session
    static clear_server_session(stype: number){
        if (server_session_map[stype]) {
            delete server_session_map[stype];
        }
    }
}

export default GatewayFunction;