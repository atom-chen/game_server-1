import Player from './Player';
import MySqlGame from '../../../database/MySqlGame';
import querystring from 'querystring';
import Log from '../../../utils/Log';
import NetBus from '../../../netbus/NetBus';
import { Stype } from '../../protocol/Stype';

class RobotPlayer extends Player{

    constructor(){
        super();
        this._is_robot = true;
    }

    async init_session(session: any, uid: number, proto_type: number) {
        await super.init_session(session, uid, proto_type);
        let data_game: any = await MySqlGame.get_ugame_uchip_by_uid(uid);
        if(data_game && data_game.length > 0){
            this.set_ugame_info(data_game[0]); 
        }

        let ugame_config: any = await MySqlGame.get_ugame_config_by_uid(uid);
        if (ugame_config && ugame_config.length > 0){
            let user_config_obj: any = querystring.decode(ugame_config[0].user_config);
            if (!user_config_obj["user_ball_level"]) {
                user_config_obj["user_ball_level"] = 1;
            }
            this.set_user_config(user_config_obj);
        }
    }

    //发送消息
    // send_cmd(ctype: number, body: any) {
    //     if (this.is_robot()) {
    //         Log.warn("RobotPlayer send to robot!!");
    //         return;
    //     }
    //     if (!this._session) {
    //         Log.error("send_cmd error, session is null!!");
    //         return;
    //     }
    //     NetBus.send_cmd(this._session, Stype.GameHoodle, ctype, this._uid, this._proto_type, body);
    // }

}

export default RobotPlayer;