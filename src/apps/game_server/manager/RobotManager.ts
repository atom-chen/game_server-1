import RobotPlayer from '../objects/RobotPlayer';
import Log from '../../../utils/Log';
import PlayerManager from './PlayerManager';
import Player from '../objects/Player';

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
        let player: Player = playerMgr.get_player(uid);
        if(player){
            await player.init_data(session, uid, proto_type);
            player.set_robot(true);
            Log.info("hcc>>robot >> alloc_robot_player old: success!! uid: " , uid );
        }else{
            player = new RobotPlayer(session, uid, proto_type);
            await player.init_data(session, uid, proto_type);
        }
        playerMgr.add_robot_player(player);
        this._robot_set[uid] = player;
        return player;
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