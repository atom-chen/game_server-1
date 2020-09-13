import SystemSend from '../SystemSend';
import MySqlSystem from '../../../database/MysqlSystem';
import Response from '../../protocol/Response';
import { Cmd } from '../../protocol/protofile/SystemProto';
import Log from '../../../utils/Log';
import { LoginRewardConfig } from '../config/LoginRewardConfig';
import ArrayUtil from '../../../utils/ArrayUtil';
import ProtoManager from '../../../netbus/ProtoManager';
import TimeUtil from '../../../utils/TimeUtil';
import MySqlGame from '../../../database/MySqlGame';

let bonues_max_days = 7;//连续签到最大天数

class LoginRewardInterface {

    //请求签到配置
    static async do_user_login_reward_config(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let data:any = await MySqlSystem.get_login_bonues_info_by_uid(utag);
        if(data){
            if(data.length <= 0){
                let ret = await MySqlSystem.insert_login_bonues_info(utag, 0, 0, 0, 0);
                if(ret){
                    LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
                }
            }else{
                let sql_info = data[0];
                let bonues_days = sql_info.days;//已签到天数
                let bonues_time = sql_info.bonues_time;
                let config = ArrayUtil.ObjClone(LoginRewardConfig);
                for (let day in config) {
                    let config_obj = config[day];
                    let day_index = Number(day); //当前天数下标
                    if (day_index <= bonues_days) {
                        config_obj["isget"] = true;
                        config_obj["canget"] = false;
                    }
                    if ((day_index == (bonues_days + 1) % bonues_max_days) || (day_index == bonues_max_days && bonues_days == bonues_max_days - 1)) {
                        if (bonues_time == 0 || bonues_time != TimeUtil.timestamp_today()) {
                            config_obj["isget"] = false;
                            config_obj["canget"] = true;
                        }
                    }
                }
                let istodaysign = bonues_time == TimeUtil.timestamp_today()
                let resbody = {
                    status: 1,
                    signdays: bonues_days,
                    istodaysign: istodaysign,
                    config: JSON.stringify(config),
                }
                Log.info("hcc>>do_user_login_reward_config: ", resbody);
                SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type, resbody);
            }
        }else{
            SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response.INVALID_PARAMS });
        }
    }

    //执行签到
    static async do_user_login_reward_sign(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (body) {
            let signofday = body.signofday;
            let time_now = TimeUtil.timestamp_today();
            let data: any = await MySqlSystem.get_login_bonues_info_by_uid(utag);
            if (data) {
                if (data.length > 0) {
                    let data_obj = data[0];
                    let bonues_time = data_obj.bonues_time;
                    let days = data_obj.days;
                    let days_now = (days + 1) % bonues_max_days;
                    Log.info("hcc>>do_user_login_reward_sign bonues_info: ", data);
                    if (bonues_time != time_now && ((signofday == days_now) || (signofday == bonues_max_days))) { // can sign
                        let ret_update = await MySqlSystem.update_login_bonues_info(utag, 0, time_now, days_now, 1);
                        if (ret_update) {
                            //增加玩家金币
                            let propcount = LoginRewardConfig[signofday].propcount;
                            if (propcount) {
                                let ret = await MySqlGame.add_ugame_uchip(utag, propcount); //增加玩家金币
                                if (ret){
                                    let rewardObj = {
                                        propid: LoginRewardConfig[signofday].propid,
                                        propcount: LoginRewardConfig[signofday].propcount,
                                    }
                                    let resbody = {
                                        status: Response.OK,
                                        rewardconfig: JSON.stringify(rewardObj),
                                    }
                                    SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, resbody);
                                    Log.info("hcc>>do_user_login_reward_sign success ", resbody);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response.INVALIDI_OPT });
    }

    //test use async await
    static async do_user_login_reward_sign_1(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (body) {
            let signofday = body.signofday;
            let time_now = TimeUtil.timestamp_today();
            let result = await MySqlSystem.test_func(utag);
        }
    }

}

export default LoginRewardInterface;