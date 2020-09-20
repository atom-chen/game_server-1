//接收客户端协议模块
import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import AuthSendMsg from './AuthSendMsg';
import CommonProto from '../protocol/protofile/CommonProto';
import Log from '../../utils/Log';
import AuthInfoInterface from './interface/AuthInfoInterface';
import AuthLoginInterface from './interface/AuthLoginInterface';
import AuthRegistInterface from './interface/AuthRegistInterface';
import AuthWeChatLoginInterface from './interface/AuthWeChatLoginInterface';
import Stype from '../protocol/Stype';
import AuthProto from '../protocol/protofile/AuthProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class AuthModel {
    private static readonly Instance: AuthModel = new AuthModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor(){
        this._cmd_handler_map = {
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]:        this.on_player_lost_connect,
            [AuthProto.XY_ID.REQ_UNAMELOGIN]:                   this.on_uname_login_req,
            [AuthProto.XY_ID.REQ_GUESTLOGIN]:                   this.on_guest_login_req,
            [AuthProto.XY_ID.REQ_UNAMEREGIST]:                  this.on_uname_regist_req,
            [AuthProto.XY_ID.REQ_LOGINOUT]:                     this.on_login_out_req,
            [AuthProto.XY_ID.REQ_USERCENTERINFO]:               this.on_get_user_center_info_req,
            [AuthProto.XY_ID.REQ_WECHATLOGIN]:                  this.on_wechat_login_req,
            [AuthProto.XY_ID.REQ_WECHATSESSIONLOGIN]:           this.on_wechat_session_login_req,
        }
    }

    public static getInstance(){
        return AuthModel.Instance;
    }

    public recv_cmd_msg(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:Buffer){
        let ctypeName = ctype == CommonProto.XY_ID.PUSH_USERLOSTCONNECTION ? "UserLostConnectRes" : AuthProto.XY_NAME[ctype];
        Log.info("recv_cmd_msg: stype:", Stype.S_NAME[stype], " ,cmdName: ", ctypeName, " ,utag: ",utag)
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }
    
    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        Log.info("on_player_lost_connect utag:", utag, body)
    }

    on_uname_login_req(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthLoginInterface.do_uname_login_req(session, utag, proto_type, raw_cmd);
    }
    
    on_guest_login_req(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthLoginInterface.do_guest_login_req(session, utag, proto_type, raw_cmd);
    }

    on_uname_regist_req(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthRegistInterface.do_uname_regist_req(session, utag, proto_type, raw_cmd);
    }

    on_get_user_center_info_req(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthInfoInterface.do_get_user_center_info_req(session, utag, proto_type, raw_cmd);
    }

    on_login_out_req(session:any, utag:number, proto_type:number,raw_cmd:any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_LOGINOUT, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthLoginInterface.do_login_out_req(session, utag, proto_type, raw_cmd);
    }

    on_wechat_login_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATLOGIN, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT})
            return;
        }
        AuthWeChatLoginInterface.do_wechat_login_req(session, utag, proto_type, raw_cmd);
    }

    on_wechat_session_login_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT })
            return;
        }
        AuthWeChatLoginInterface.do_wechat_session_login_req(session, utag, proto_type, raw_cmd);
    }
}

export default AuthModel;