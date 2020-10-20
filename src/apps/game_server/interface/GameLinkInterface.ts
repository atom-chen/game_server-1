//登录，断线协议处理
import Player from '../cell/Player';
import Log from '../../../utils/Log';
import Response from '../../protocol/Response';
import PlayerManager from '../manager/PlayerManager';
import GameFunction from './GameFunction';
import GameSendMsg from '../GameSendMsg';
import ProtoManager from '../../../netbus/ProtoManager';
import RobotManager from '../manager/RobotManager';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import GameCheck from './GameCheck';
import RedisLobby from '../../../database/RedisLobby';
import GameServerData from '../GameServerData';
import Room from '../cell/Room';

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
            GameFunction.broadcast_player_info_in_rooom(room, player.get_uid());
        }
    }

    //玩家断线
    static do_player_lost_connect(session:any, utag:number, proto_type:number, raw_cmd:Buffer){
        if (!GameCheck.check_player(utag)) {
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

        let player: Player = playerMgr.get_player(utag);
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
                GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.OK })
                RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());

                ////////////////  连接逻辑服务后，同步其他玩家，房间内玩家数据
                let room = await player.get_room()
                if(room){
                    GameFunction.broadcast_player_info_in_rooom(room, player.get_uid());
                }
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
                GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.OK })
                RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());

                ////////////////  连接逻辑服务后，同步其他玩家，房间内玩家数据
                let room = await newPlayer.get_room()
                if (room) {
                    GameFunction.broadcast_player_info_in_rooom(room, newPlayer.get_uid());
                }
                return;
            }
        }
        GameSendMsg.send(session, GameHoodleProto.XY_ID.eLoginLogicRes, utag, proto_type, { status: Response.SYSTEM_ERR })
    }
}

export default GameLinkInterface;
