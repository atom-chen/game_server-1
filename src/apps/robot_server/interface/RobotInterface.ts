import RobotSend from '../RobotSend';
import { Cmd } from '../../protocol/GameHoodleProto';
import RobotListConfig from '../config/RobotListConfig';
import * as util from 'util';
import StringUtil from '../../../utils/StringUtil';
import Log from '../../../utils/Log';

class RobotInterface {

    //登录逻辑服务
    static robot_login_logic_server(server_session:any){
        let robot_roomlevel_map = RobotListConfig.robot_roomlevel_map;
        let body = { isrobot: true}
        for(let key in robot_roomlevel_map){
            let robot_uid_list:Array<number> = robot_roomlevel_map[key];
            robot_uid_list.forEach(uid =>{
                RobotSend.send_game(server_session,Cmd.eLoginLogicReq, uid, body);
            });
        }
    }

    //去对应等级房间匹配
    static go_to_match_game(server_session:any, utag:number){
        let robot_roomlevel_map = RobotListConfig.robot_roomlevel_map;
        for (let key in robot_roomlevel_map) {
            let robot_uid_list: Array<number> = robot_roomlevel_map[key];
            if (robot_uid_list) {
                let ret = robot_uid_list.indexOf(utag);
                if (ret > -1) {
                    let body = { roomlevel: Number(key) }
                    RobotSend.send_game(server_session, Cmd.eUserMatchReq, utag, body);
                    break;
                }
            }
        }
    }

    //不定时发送表情
    static send_emoj_random_timeout(server_session: any, utag:number, time_out?:number){
        if(util.isNullOrUndefined(time_out)){
            time_out = 0;
        }
        setTimeout(() => {
            RobotInterface.send_emoj_random(server_session, utag);
        }, time_out);
    }

    //发送随机表情 50%概率发送
    static send_emoj_random(server_session:any, utag:number){
        let random_num = StringUtil.random_int(1, 10);
        Log.info("is show emoj: ", random_num, random_num <= 5);
        if (random_num <= 5) {
            let emojIndex = StringUtil.random_int(1, RobotListConfig.TOTAL_EMOJ_COUNT);
            let body = { emojconfig: String(emojIndex) }
            RobotSend.send_game(server_session, Cmd.eUserEmojReq, utag, body);
        }
    }
}

export default RobotInterface;