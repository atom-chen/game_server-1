import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import AuthProto from '../../protocol/protofile/AuthProto';
import RedisAuthCenter from '../../../database/RedisAuth';

class AuthInfoInterface {

    static async do_get_user_center_info_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let data:any = await MySqlAuth.get_uinfo_by_uid(utag);
        if (data && data.length > 0){
            let sql_info = data[0]
            let resbody = {
                status: Response.OK,
                usercenterinfo: JSON.stringify(sql_info),
            }
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, resbody);
           RedisAuthCenter.set_uinfo_inredis(utag, sql_info);
            return;
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response.ILLEGAL_ACCOUNT });
    }

}

export default AuthInfoInterface;