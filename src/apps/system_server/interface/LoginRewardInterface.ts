import SystemSend from '../SystemSend';
import MySqlSystem from '../../../database/MysqlSystem';
import Response from '../../protocol/Response';
import { Cmd } from '../../protocol/SystemProto';
import Log from '../../../utils/Log';
import { LoginRewardConfig } from '../config/LoginRewardConfig';
import ArrayUtil from '../../../utils/ArrayUtil';
import ProtoManager from '../../../netbus/ProtoManager';
import TimeUtil from '../../../utils/TimeUtil';
import MySqlGame from '../../../database/MySqlGame';

let bonues_max_days = 7;//连续签到最大天数

class LoginRewardInterface {

    static do_user_login_reward_config(session: any, utag: number, proto_type: number, raw_cmd: any) {
        MySqlSystem.get_login_bonues_info_by_uid(utag, function (status: number, data: any) {
            if (status == Response.OK) {
                if(data.length <= 0){
                    MySqlSystem.insert_login_bonues_info(utag, 0, 0, 0, 0,function(ins_status:number, ins_data:any) {
                        if (ins_status != Response.OK) {
                            SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response.INVALID_PARAMS })
                            return;
                        }
                        LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
                    });
                }else{
                    let sql_info = data[0];
                    let bonues_days = sql_info.days;//已签到天数
                    let bonues_time = sql_info.bonues_time;
                    let config = ArrayUtil.ObjClone(LoginRewardConfig);
                    for(let day in config){
                        let config_obj = config[day];
                        let day_index = Number(day); //当前天数下标
                        if (day_index <= bonues_days){
                            config_obj["isget"] = true;
                            config_obj["canget"] = false;
                        }
                        if ((day_index == (bonues_days + 1) % bonues_max_days)){
                            if (bonues_time == 0 || bonues_time != TimeUtil.timestamp_today()){
                                config_obj["isget"] = false;
                                config_obj["canget"] = true;
                            }
                        }
                    }
                    let istodaysign = bonues_time == TimeUtil.timestamp_today()
                    let resbody = {
                        status: 1,
                        signdays: bonues_days,
                        istodaysign : istodaysign,
                        config: JSON.stringify(config),
                    }
                    Log.info("hcc>>do_user_login_reward_config: " , resbody);
                    SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type, resbody);
                }
            } else {
                SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response.INVALID_PARAMS });
            }
        })
    }

    static do_user_login_reward_sign(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (body){
            let signofday = body.signofday;
            let time_now = TimeUtil.timestamp_today();
            MySqlSystem.get_login_bonues_info_by_uid(utag, function (status: number, data: any) {
                if (status == Response.OK) {
                    if(data.length > 0){
                        let data_obj = data[0];
                        let bonues_time = data_obj.bonues_time;
                        let days = data_obj.days;
                        let days_now = (days + 1) %  bonues_max_days;
                        Log.info("hcc>>do_user_login_reward_sign bonues_info: " , data );
                        if (bonues_time != time_now && signofday == days_now){ // can sign
                            MySqlSystem.update_login_bonues_info(utag, 0, time_now, days_now, 1, function(bonues_stauts:number, bonues_data:any) {
                                if (bonues_stauts == Response.OK){
                                    //增加玩家金币
                                    let propcount = LoginRewardConfig[signofday].propcount;
                                    if (propcount){
                                        MySqlGame.add_ugame_uchip(utag, propcount); //增加玩家金币
                                        let rewardObj = {
                                            propid: LoginRewardConfig[signofday].propid,
                                            propcount: LoginRewardConfig[signofday].propcount,
                                        }
                                        let resbody = {
                                            status : Response.OK,
                                            rewardconfig : JSON.stringify(rewardObj),
                                        }
                                        SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, resbody);
                                        Log.info("hcc>>do_user_login_reward_sign success " , resbody);
                                    }
                                }else{
                                    SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, {status:Response.INVALIDI_OPT});
                                    Log.info("hcc>>do_user_login_reward_sign failed 111");
                                }
                            });
                        }else{
                            SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response.INVALIDI_OPT });
                            Log.info("hcc>>do_user_login_reward_sign failed 222");
                        }
                    }else{
                        SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response.INVALIDI_OPT });
                        Log.info("hcc>>do_user_login_reward_sign failed 333");
                    }
                }
            })
        }
    }

}

export default LoginRewardInterface;