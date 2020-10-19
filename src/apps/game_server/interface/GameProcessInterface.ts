//游戏过程，进房间数据推送，玩家准备协议处理
import Player from '../cell/Player';
import Log from '../../../utils/Log';
import Response from '../../protocol/Response';
import PlayerManager from '../manager/PlayerManager';
import { GameState, UserState } from '../config/State';
import GameFunction from './GameFunction';
import GameCheck from './GameCheck';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import GameSendMsg from '../GameSendMsg';
import Room from '../cell/Room';

let playerMgr: PlayerManager = PlayerManager.getInstance();

class GameProcessInterface {

    //玩家进入房间收到，服务主动推送相关局内数据
    static async do_player_check_link_game(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (!GameCheck.check_player(utag)){
            Log.warn("check_link_game player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eCheckLinkGameRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }

        let player:Player = playerMgr.get_player(utag);
        if (!player) { return; }
        
        let room: Room = await player.get_room();
        if (!room) { return; }

        player.send_cmd( GameHoodleProto.XY_ID.eCheckLinkGameRes, { status: Response.OK });
        player.send_cmd( GameHoodleProto.XY_ID.eRoomIdRes, { roomid: room.get_room_id() });
        player.send_cmd( GameHoodleProto.XY_ID.eGameRuleRes, { gamerule: room.get_game_rule()});
        player.send_cmd(GameHoodleProto.XY_ID.ePlayCountRes, { playcount: String(room.get_cur_play_count()), totalplaycount: String(room.get_max_play_count())});

        GameFunction.send_player_info(player);
        //处理断线重连,只发送给重连玩家
        //玩家位置，局数，玩家权限，玩家得分
        if (room.get_game_state() == GameState.Gameing) {
            player.send_cmd(GameHoodleProto.XY_ID.eGameStartRes, { status: Response.OK })
            GameFunction.send_player_ball_pos(room, undefined, player);
            GameFunction.send_player_power(room, undefined, player);
            GameFunction.send_player_score(room, undefined, player);
        }

        //如果有机器人，要发权限给机器人,防止机器人射击之后，别的玩家退出，再进来，卡了
        if (room.get_game_state() == GameState.Gameing) {
            let player_set = room.get_all_player();
            for(let idx in player_set){
                let p:Player = player_set[idx];
                if(p.is_robot()){
                    GameFunction.send_player_power(room, undefined, p);
                }
            }
        }
    }
    
    //玩家准备
    static async do_player_ready(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (!GameCheck.check_player(utag)) {
            Log.warn("on_user_ready player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserReadyRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            return;
        }

        let player: Player = playerMgr.get_player(utag);

        let userstate = player.get_user_state()
        if (userstate == UserState.Ready || userstate == UserState.Playing) {
            Log.warn(player.get_unick(), "on_user_ready user is already ready or is playing!")
            player.send_cmd(GameHoodleProto.XY_ID.eUserReadyRes, { status: Response.INVALIDI_OPT })
            return;
        }

        let room:Room = await player.get_room()
        if (room) {
            //已经在游戏中了
            if (room.get_game_state() == GameState.Gameing) {
                player.send_cmd(GameHoodleProto.XY_ID.eUserReadyRes, { status: Response.INVALIDI_OPT })
                Log.warn("on_user_ready error ,game is playing!")
                return;
            }

            //已经大结算了
            if (room.get_cur_play_count() == room.get_max_play_count()) {
                player.send_cmd(GameHoodleProto.XY_ID.eUserReadyRes, { status: Response.INVALIDI_OPT })
                Log.warn("on_user_ready error ,game is over!")
                return;
            }
            //有玩家准备了，发送状态
            player.set_user_state(UserState.Ready);
            GameFunction.send_player_state(room, player)

            //游戏开始了
            let is_game_start = GameCheck.check_game_start(room);
            if (is_game_start) {
                GameFunction.set_all_player_state(room, UserState.Playing);
                GameFunction.broadcast_player_info_in_rooom(room); //刷新局内玩家信息：Playing

                //设置游戏状态为游戏中
                room.set_game_state(GameState.Gameing);
                //发送游戏开始
                room.broadcast_in_room(GameHoodleProto.XY_ID.eGameStartRes, { status: Response.OK })
                //游戏逻辑发送
                GameFunction.send_player_first_pos(room);
                //设置初始权限
                GameFunction.set_player_start_power(room);
                //玩家权限发送
                GameFunction.send_player_power(room);
                //发送分数
                GameFunction.send_player_score(room);
                //局数自加
                room.set_cur_play_count(room.get_cur_play_count() + 1);
                //发送局数
                GameFunction.send_play_count(room);
            }
        }
    }
}

export default GameProcessInterface;