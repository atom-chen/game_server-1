import RobotSend from '../RobotSend';
import { Cmd } from '../../protocol/GameHoodleProto';
import RobotListConfig from '../config/RobotListConfig';
import * as util from 'util';
import StringUtil from '../../../utils/StringUtil';
import Log from '../../../utils/Log';

class RobotGameInterface {

    //登录逻辑服务
    static robot_login_logic_server(server_session:any, utag:number){
        RobotSend.send_game(server_session, Cmd.eLoginLogicReq, utag, { isrobot: true });
    }

    //去对应等级房间匹配
    static go_to_match_game(server_session:any, utag:number){
        for (let _utag in RobotListConfig.robot_roomlevel_map) {
            let robot_obj = RobotListConfig.robot_roomlevel_map[_utag];
            let utagtmp = Number(_utag);
            let room_level = robot_obj.roomlevel;
            if (utagtmp == utag){
                RobotSend.send_game(server_session, Cmd.eUserMatchReq, utag, { roomlevel: room_level });
                break;
            }
        }
    }

    //不定时发送表情
    static send_emoj_random_timeout(server_session: any, utag:number, time_out?:number){
        if(util.isNullOrUndefined(time_out)){
            time_out = 0;
        }
        setTimeout(() => {
            RobotGameInterface.send_emoj_random(server_session, utag);
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

export default RobotGameInterface;