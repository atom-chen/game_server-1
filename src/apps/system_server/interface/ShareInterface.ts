import MySqlGame from '../../../database/MySqlGame';
import ArrayUtil from "../../../utils/ArrayUtil";
import querystring from 'querystring';
import Log from "../../../utils/Log";
import Response from '../../protocol/Response';
import TimeUtil from '../../../utils/TimeUtil';
import SystemSend from '../SystemSend';
import SystemConfig from '../config/SystemConfig';
import SystemProto from '../../protocol/protofile/SystemProto';

class ShareInterface {
    static async dn_user_share_req(session: any, utag:number, proto_type:number, raw_cmd:Buffer){
        if (utag == 0) {
            SystemSend.send(session, SystemProto.XY_ID.RES_USERSHARE, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }
        let sql_ret: any = await MySqlGame.get_ugame_config_by_uid(utag);
        if (sql_ret) {
            let ret_len = ArrayUtil.GetArrayLen(sql_ret);
            if (ret_len > 0) {
                try {
                    let info = sql_ret[0];
                    let user_config_obj: any = querystring.decode(info.user_config);
                    // Log.info("hcc>>dn_user_share_req: ", user_config_obj);
                    let share_time = user_config_obj[SystemConfig.SHARE_DATE_TIME];
                    if (!share_time || share_time != TimeUtil.timestamp_today()) {//没签到
                        user_config_obj[SystemConfig.SHARE_DATE_TIME] = TimeUtil.timestamp_today();
                        let ret_config = await MySqlGame.update_ugame_user_config(utag, user_config_obj);
                        if (ret_config){
                            let ret = await MySqlGame.add_ugame_uchip(utag, SystemConfig.SHARE_REWARD_COUNT);
                            if (ret) {
                                SystemSend.send(session, SystemProto.XY_ID.RES_USERSHARE, utag, proto_type, { status: Response.SUCCESS});
                                Log.info("hcc>>dn_user_share_req>> not share, share success!", utag);
                            }
                            return;
                        }
                    } else {//已经签到
                        Log.info("hcc>>dn_user_share_req>> already share!!",utag);
                    }
                } catch (error) {
                    Log.error(error);
                }
            }
        }
        //已经签到或者签到失败
        SystemSend.send(session, SystemProto.XY_ID.RES_USERSHARE, utag, proto_type, { status: Response.ERROR_1 });
    }
}

export default ShareInterface;