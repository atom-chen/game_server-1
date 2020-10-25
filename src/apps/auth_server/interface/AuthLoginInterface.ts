import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import AuthSendMsg from "../AuthSendMsg";
import ProtoManager from '../../../netengine/ProtoManager';
import StringUtil from "../../../utils/StringUtil";
import AuthProto from '../../protocol/protofile/AuthProto';

class AuthLoginInterface {

    static async do_uname_login_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (!body) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ERROR_2 })
            return;
        }
        if (!body.uname || !body.upwd) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ERROR_3 })
            return;
        }

        if (body.uname.length < 6 || body.upwd.length < 6) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ERROR_4 })
            return;
        }

        let data: any = await MySqlAuth.login_by_uname_upwd(body.uname, body.upwd);
        if(data){
            if(data.length > 0){
                let sql_info = data[0]
                let resbody = {
                    status: Response.SUCCESS,
                    uid: Number(sql_info.uid),
                    logininfo: JSON.stringify(sql_info),
                }
                AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, resbody)
                return;
            }
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMELOGIN, utag, proto_type, { status: Response.ERROR_4 })
    }

    static async do_guest_login_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (!body) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ERROR_2 })
            return;
        }

        if (!body.guestkey) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ERROR_3 })
            return;
        }
        if (body.guestkey.length < 32) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ERROR_4 })
            return;
        }
        
        let data:any = await MySqlAuth.login_by_guestkey(body.guestkey);
        if (data){
            if(data.length <= 0){
                var unick = "gst"
                var usex = StringUtil.random_int(0, 1);
                var uface = StringUtil.random_int(1, 9);
                let insert_ret:any = await MySqlAuth.insert_guest_user(unick, uface, usex, body.guestkey);
                if (insert_ret){
                    AuthLoginInterface.do_guest_login_req(session, utag, proto_type, raw_cmd);
                }
            }else{
             let sql_info = data[0]
                let resbody = {
                    status: Response.SUCCESS,
                    uid: Number(sql_info.uid),
                    logininfo: JSON.stringify(sql_info),
                }
                // Log.info("hcc>>login_by_guestkey: ", resbody)
                AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, resbody)
                return;
            }
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_GUESTLOGIN, utag, proto_type, { status: Response.ERROR_4 })
    }

    static do_login_out_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_LOGINOUT, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        if(utag != 0){
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_LOGINOUT, utag, proto_type, { status: Response.SUCCESS})
        }
    }

}

export default AuthLoginInterface;