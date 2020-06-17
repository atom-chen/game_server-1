import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import { Cmd } from "../../protocol/AuthProto";

class AuthInfoInterface {

    static async do_get_user_center_info_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let data:any = await MySqlAuth.get_uinfo_by_uid(utag);
        if (data && data.length > 0){
            let sql_info = data[0]
            let resbody = {
                status: 1,
                usercenterinfostring: JSON.stringify(sql_info),
            }
            // Log.info("get_user_center_info:", resbody)
            AuthSendMsg.send(session, Cmd.eGetUserCenterInfoRes, utag, proto_type, resbody);
            return;
        }
        AuthSendMsg.send(session, Cmd.eGetUserCenterInfoRes, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT });
    }

}

export default AuthInfoInterface;