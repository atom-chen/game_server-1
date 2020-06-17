import RobotPlayer from './RobotPlayer';
import Log from '../../../utils/Log';
import PlayerManager from './PlayerManager';
import Player from './Player';
import RoomManager from './RoomManager';
import { UserState } from './config/State';
import ProtoTools from '../../../netbus/ProtoTools';

let playerMgr = PlayerManager.getInstance();

// let robot_uid = [1921, 1922, 1923];
let robot_uid = [1921];

class RobotManager {
    private static readonly Instance: RobotManager = new RobotManager();

    private constructor() {

    }

    public static getInstance() {
        return RobotManager.Instance;
    }

    async generate_robot(){
        robot_uid.forEach(async uid => {
            await this.alloc_robot_player(uid);
        });
    }

    async alloc_robot_player(uid: number) {
        let player: Player = playerMgr.get_player(uid);
        if(player){
            let playerinfo: any = await player.init_session(null, uid, ProtoTools.ProtoType.PROTO_BUF);
            player.set_robot(true);
            Log.info("hcc>>robot playerinfo old: ", playerinfo);
        }else{
            player = new RobotPlayer();
            let playerinfo: any = await player.init_session(null, uid, ProtoTools.ProtoType.PROTO_BUF);
            Log.info("hcc>>robot playerinfo new: ", playerinfo);
        }
        playerMgr.add_robot_player(player);
    }

    get_free_robot_player(){
        let player_set = playerMgr.get_player_set();
        for(let indx in player_set){
            let p:Player = player_set[indx];
            if (p.is_robot() && p.get_user_state() == UserState.InView){
                if (!RoomManager.getInstance().get_room_by_uid(p.get_uid())){
                    return p;
                }
            }
        }
    }

    delete_robot_player(uid: number): boolean {
        return playerMgr.delete_player(uid);
    }

}

export default RobotManager;