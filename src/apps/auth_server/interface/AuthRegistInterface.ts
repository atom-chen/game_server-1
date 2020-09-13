import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import ProtoManager from '../../../netbus/ProtoManager';
import StringUtil from "../../../utils/StringUtil";
import AuthProto from '../../protocol/protofile/AuthProto';

class AuthRegistInterface {

    static async do_uname_regist_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        // Log.info("uname_regist cmd: ", body)

        if (!body) {
            Log.warn("uname_regist error, regist body is null")
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: Response.INVALID_PARAMS })
            return;
        }

        if (!body.uname || !body.upwdmd5) {
            Log.warn("uname_regist error, regist uname or upwdmd5 is null")
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: Response.INVALID_PARAMS })
            return;
        }

        if (body.uname.length < 6 || body.upwdmd5.length < 6) {
            Log.warn("uname_regist error, regist uname or upwdmd5 length is < 6")
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: Response.INVALID_PARAMS })
            return;
        }

        let unick = "user";
        var usex = StringUtil.random_int(0, 1);
        var uface = StringUtil.random_int(1, 9);
        let ret = await MySqlAuth.check_uname_exist(body.uname);
        if(ret == false){
            let insert_ret = await MySqlAuth.insert_uname_upwd_user(body.uname, body.upwdmd5, unick, uface, usex);
            if (insert_ret){
                AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: 1 })
                return;
            }
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_UNAMEREGIST, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT });
    }

}

export default AuthRegistInterface;