import Player from './Player';
import MySqlGame from '../../../database/MySqlGame';
import querystring from 'querystring';
import GameHoodleConfig from '../config/GameHoodleConfig';

class RobotPlayer extends Player{

    constructor(session: any, uid: number, proto_type: number){
        super(session, uid, proto_type);
        this._is_robot = true;
    }

    async init_data(session:any, uid:number, proto_type:number){
        let ret = super.init_data(session, uid, proto_type)
        let ugame_config: any = await MySqlGame.get_ugame_config_by_uid(this._uid);
        if (ugame_config && ugame_config.length > 0) {
            let user_config_obj: any = querystring.decode(ugame_config[0].user_config);
            if (!user_config_obj[GameHoodleConfig.USER_BALL_LEVEL_STR]) {
                user_config_obj[GameHoodleConfig.USER_BALL_LEVEL_STR] = 1;
            }
            this.set_user_config(user_config_obj);
        }
        return ret;
    }

}

export default RobotPlayer;