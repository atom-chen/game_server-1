import RobotPlayer from '../cell/RobotPlayer';
import Log from '../../../../utils/Log';
import PlayerManager from './PlayerManager';
import Player from '../cell/Player';
import RoomManager from './RoomManager';
import { UserState } from '../config/State';

let playerMgr = PlayerManager.getInstance();

class RobotManager {
    private static readonly Instance: RobotManager = new RobotManager();

    _robot_set:any = {}

    private constructor() {

    }

    public static getInstance() {
        return RobotManager.Instance;
    }

    async alloc_robot_player(session:any, uid: number, proto_type:number) {
        let player: any = playerMgr.get_player(uid);
        if(player){
            let issuccess = await player.init_session(session, uid, proto_type);
            player.set_robot(true);
            Log.info("hcc>>robot >> alloc_robot_player old: success!! uid: " , uid );
        }else{
            player = new RobotPlayer();
            let issuccess = await player.init_session(session, uid, proto_type);
            Log.info("hcc>>robot >> alloc_robot_player success!! uid:" , uid);
        }
        playerMgr.add_robot_player(player);
        this._robot_set[uid] = player;
        return player;
    }

    get_free_robot_player(){
        let player_set = this._robot_set;
        for(let indx in player_set){
            let p:Player = player_set[indx];
            if (p.is_robot() && p.get_user_state() == UserState.InView){
                if (!RoomManager.getInstance().get_room_by_uid(p.get_uid())){
                    return p;
                }
            }
        }
    }

    get_robot_player_set(){
        return this._robot_set;
    }

    delete_robot_player(uid: number): boolean {
        if (this._robot_set[uid]) {
            this._robot_set[uid] = null;
            delete this._robot_set[uid];
        }
        return playerMgr.delete_player(uid);
    }

}

export default RobotManager;