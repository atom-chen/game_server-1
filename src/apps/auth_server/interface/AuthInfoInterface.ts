import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import AuthProto from '../../protocol/protofile/AuthProto';
import RedisAuth from '../../../database/RedisAuth';

class AuthInfoInterface {

    static async do_get_user_center_info_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        let data:any = await MySqlAuth.get_uinfo_by_uid(utag);
        if (data && data.length > 0){
            let sql_info = data[0]
            let resbody = {
                status: Response.SUCCESS,
                usercenterinfo: JSON.stringify(sql_info),
            }
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, resbody);
            await RedisAuth.set_uinfo_inredis(utag, sql_info);
            // let outInfo = await RedisAuth.get_uinfo_inredis(utag);
            // Log.info("hcc>>outInfo:" , outInfo);
            return;
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response.ERROR_2 });
    }

}

export default AuthInfoInterface;