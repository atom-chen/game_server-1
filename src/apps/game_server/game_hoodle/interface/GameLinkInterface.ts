//登录，断线协议处理
import Player from '../Player';
import { Cmd } from "../../../protocol/GameHoodleProto";
import Log from '../../../../utils/Log';
import Response from '../../../protocol/Response';
import PlayerManager from '../PlayerManager';
import RoomManager from '../RoomManager';
import GameFunction from './GameFunction';
import MatchManager from '../MatchManager';
import GameSendMsg from '../GameSendMsg';
import { GameState } from '../config/State';

let playerMgr: PlayerManager    = PlayerManager.getInstance();
let roomMgr: RoomManager        = RoomManager.getInstance();
let matchMgr: MatchManager      = MatchManager.getInstance();

class GameLinkInterface {

    //玩家断线
    static do_player_lost_connect(utag:number){
        let player: Player = playerMgr.get_player(utag);
        if (player) {

            //设置房间内玩家掉线
            let room = roomMgr.get_room_by_uid(utag);
            if (room) {
                player.set_offline(true)
                room.broadcast_in_room(Cmd.eUserOfflineRes, { seatid: player.get_seat_id() }, player);
                GameFunction.broadcast_player_info_in_rooom(room, player);
            }

            //删掉玩家对象，但是如果在房间里面，玩家引用还会在房间里面，方便下次重连
            let uname = player.get_unick();
            let numid = player.get_numberid();
            let issuccess = playerMgr.delete_player(utag);
            if(issuccess){
                Log.warn(uname + " ,numid:" + numid + " is lostconnect,totalPlyaerCount: " + playerMgr.get_player_count());
            }
            
            //如果在匹配，就从匹配列表中删除
            let ret = matchMgr.stop_player_match(player.get_uid());
            if (ret) {
                Log.info(uname, "delete from match")
            }

            //如果在匹配房间内游戏还没开始，达到条件房间就解散
            if(room && room.get_is_match_room()){
                if (room.get_game_state() != GameState.InView){ //游戏已经开始，不能直接解散
                    return;
                }
                //游戏还没开始，而且没有在线玩家，房间解散

                let playerCount = room.get_player_count();
                let onlinePlayerCount = room.get_online_player_count();
                Log.info("hcc>>do_player_lost_connect: playerCouont: ", playerCount, " ,onlinePlayerCount: ", onlinePlayerCount);
                if (playerCount == 0 || onlinePlayerCount == 0){
                    room.kick_all_player();
                    let roomID = room.get_room_id();
                    let ret = roomMgr.delete_room(roomID);
                    Log.info("hcc>>do_player_lost_connect>>delete room :", ret, " ,roomid: ", roomID); 
                }
            }
        }
    }

    //玩家登录逻辑服务
    static do_player_login_logic_server(session: any, utag: number, proto_type: number){
        let player: Player = playerMgr.get_player(utag)
        if (player) {
            Log.info("player is exist, uid: ", utag)
            player.init_session(session, utag, proto_type, function (status: number, data: any) {
                if (status == Response.OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    let room = roomMgr.get_room_by_uid(utag);
                    if (room) {
                        let oldPlayer: Player = room.get_player(utag);
                        if (oldPlayer) {
                            player.set_player_info(oldPlayer.get_player_info())
                        }
                    }
                    GameSendMsg.send(session, Cmd.eLoginLogicRes, utag, proto_type, { status: Response.OK })
                } else {
                    GameSendMsg.send(session, Cmd.eLoginLogicRes, utag, proto_type, { status: Response.SYSTEM_ERR })
                }
            })
        } else {
            Log.info("player is not exist , new player uid: ", utag)
            playerMgr.alloc_player(session, utag, proto_type, function (status: number, data: any) {
                if (status == Response.OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    let newPlayer: Player = playerMgr.get_player(utag);
                    let room = roomMgr.get_room_by_uid(utag);
                    if (room) {
                        let oldPlayer: Player = room.get_player(utag);
                        if (oldPlayer) {
                            newPlayer.set_player_info(oldPlayer.get_player_info())
                        }
                    }
                    GameSendMsg.send(session, Cmd.eLoginLogicRes, utag, proto_type, { status: Response.OK })
                } else {
                    GameSendMsg.send(session, Cmd.eLoginLogicRes, utag, proto_type, { status: Response.SYSTEM_ERR })
                }
            })
        }
    }
}

export default GameLinkInterface;
