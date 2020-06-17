import Player from './Player';
import ArrayUtil from '../../../utils/ArrayUtil';
import Log from '../../../utils/Log';
import RobotPlayer from './RobotPlayer';

class PlayerManager {
    private static readonly Instance: PlayerManager = new PlayerManager();

    private _player_set:any = {} //uid-->Player

    private constructor(){

    }

    public static getInstance(){
        return PlayerManager.Instance;
    }

    async alloc_player(session:any, uid:number, proto_type:number){
        let player:Player = this._player_set[uid]
        if(player){
            let player_info: any = await player.init_session(session, uid, proto_type);
            // Log.info("alloc_player>> user: ", uid, " is exist!, info: " , player_info);
            return player;
        }
        let player2:Player = new Player();
        this._player_set[uid] = player2;
        let player2_info: any = await player2.init_session(session, uid, proto_type);
        // Log.info("alloc_player>> user: ", uid, " is not exist!, info: ", player2_info);
        return player2;
    }

    get_player(uid:number){
        if(this._player_set[uid]){
            return this._player_set[uid];
        }
        return null;
    }

    delete_player(uid:number):boolean{
        if(this._player_set[uid]){
            this._player_set[uid] = null;
            delete this._player_set[uid];
            return true;
        }
        return false;
    }

    get_player_count(){
        return ArrayUtil.GetArrayLen(this._player_set);
    }

    add_robot_player(player:RobotPlayer){
        this._player_set[player.get_uid()] = player;
    }

    get_player_set(){
        return this._player_set;
    }

}

export default PlayerManager;