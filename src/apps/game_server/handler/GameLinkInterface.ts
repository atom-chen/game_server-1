//登录，断线协议处理
import Player from '../objects/Player';
import Log from '../../../utils/Log';
import Response from '../../protocol/Response';
import PlayerManager from '../manager/PlayerManager';
import GameSendMsg from '../GameSendMsg';
import ProtoManager from '../../../netengine/ProtoManager';
import RobotManager from '../manager/RobotManager';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import RedisLobby from '../../../database/RedisLobby';
import GameServerData from '../GameServerData';
import Room from '../objects/Room';
import SendLogicInfo from './SendLogicInfo';

let playerMgr: PlayerManager    = PlayerManager.getInstance();

class GameLinkInterface {

    private static async _player_lost_connect(player:Player){
        if(!player){
            return;
        }
    
        //设置房间内玩家掉线
        let room:Room = await player.get_room();
        if (room) {
            player.set_offline(true)
            player.send_all(GameHoodleProto.XY_ID.eUserOfflineRes, { seatid: player.get_seat_id() }, player.get_uid());
            SendLogicInfo.broadcast_player_info_in_rooom(room, player.get_uid());
        }
    }

    //玩家断线
    static do_player_lost_connect(session:any, utag:number, proto_type:number, raw_cmd:Buffer){
        let player: Player = playerMgr.get_player(utag);
        if (!player){
            return;
        }
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if(body && body.is_robot == true){//机器人服务掉线，删掉所有机器人
            let robot_player_set = RobotManager.getInstance().get_robot_player_set();
            for(let key in robot_player_set){
                GameLinkInterface._player_lost_connect(robot_player_set[key]);
            }
            return;
        }

        if (player){
            GameLinkInterface._player_lost_connect(player);
        }
    }

    //玩家登录逻辑服务
    static async do_player_login_logic_server(session: any, utag: number, proto_type: number, raw_cmd:any){
        let player: Player = playerMgr.get_player(utag);
        if(player){
            Log.info("player is exist, uid: ", utag, "is rotot: ", player.is_robot(), "playerCount:", playerMgr.get_player_count());
            let issuccess: any = await player.init_data(session,utag,proto_type);
            if(issuccess){
                GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.SUCCESS })
                RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());
                return;
            }
        }else{
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            let newPlayer = null;
            if (body && body.isrobot == true) {
                newPlayer = await RobotManager.getInstance().alloc_robot_player(session, utag, proto_type);
            } else {
                newPlayer = await playerMgr.alloc_player(session, utag, proto_type);
            }
            Log.info("hcc>> new player success!!! , isrobot: ", newPlayer.is_robot(), " ,uid:", newPlayer.get_uid(), "playerCount:", playerMgr.get_player_count());
            if (newPlayer) {
                GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.SUCCESS })
                RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());
                return;
            }
        }
        GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.ERROR_1 })
    }
}

export default GameLinkInterface;
