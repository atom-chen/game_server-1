//游戏逻辑协议处理
import Player from '../Player';
import Log from '../../../../utils/Log';
import PlayerManager from '../PlayerManager';
import RoomManager from '../RoomManager';
import { UserState, GameState } from '../config/State';
import ProtoManager from '../../../../netbus/ProtoManager';
import GameFunction from './GameFunction';
import GameCheck from './GameCheck';
import { RoomListConfig } from '../config/RoomListConfig';

let playerMgr: PlayerManager    = PlayerManager.getInstance();
let roomMgr: RoomManager        = RoomManager.getInstance();

class GameLogicInterface {

    static do_player_shoot(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(),"on_player_shoot room is not exist!")
            return;
        }
        let userstate = player.get_user_state()
        if (userstate != UserState.Playing) {
            Log.warn(player.get_unick(), "on_player_shoot user is not in playing state!")
            return;
        }

        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != GameState.Gameing) {
                Log.warn(player.get_unick(),"on_player_shoot room is not in playing state!")
                return;
            }
            //发送玩家射击信息
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            GameFunction.send_player_shoot(room, body, player);
            //设置下一个玩家射击权限
            GameFunction.set_next_player_power(room);
            //发送权限
            // GameFunction.send_player_power(room); //在玩家停下来的时候发送权限，不在这里发
        }
    }

    static do_player_ball_pos(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = PlayerManager.getInstance().get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(), "on_player_ball_pos room is not exist!")
            return;
        }

        let userstate = player.get_user_state()
        if (userstate != UserState.Playing) {
            Log.warn(player.get_unick(), "on_player_ball_pos user is not in playing state!")
            return;
        }

        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != GameState.Gameing) {
                Log.warn(player.get_unick(), "on_player_ball_pos room is not in playing state!")
                return;
            }

            let player_set = room.get_all_player();
            //保存玩家位置信息
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            // Log.info("hcc>>on_player_ball_pos ", body);
            for (let key in body.positions) {
                let posinfo = body.positions[key];
                let seatid = posinfo.seatid;
                let posx = posinfo.posx;
                let posy = posinfo.posy;
                for (let k in player_set) {
                    let p: Player = player_set[k];
                    if (p && p.get_seat_id() == seatid) {
                        let pos_info = { posx: posx, posy: posy };
                        p.set_user_pos(pos_info);
                        break;
                    }
                }
            }
            //重新发送玩家位置信息
            GameFunction.send_player_ball_pos(room);
            //小球停下来后，才发送权限
            GameFunction.send_player_power(room);
        }
    }

    static async do_player_is_shooted(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(), "on_player_is_shooted room is not exist!")
            return;
        }

        let userstate = player.get_user_state()
        if (userstate != UserState.Playing) {
            Log.warn(player.get_unick(), "on_player_is_shooted user is not in playing state!")
            return;
        }

        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != GameState.Gameing) {
                Log.warn(player.get_unick(), "on_player_is_shooted room is not in playing state!")
                return;
            }

            //先转发射中消息
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            GameFunction.send_player_is_shooted(room, body)

            let baseScore = 1;
            if (room.get_is_match_room()) {
                let levelConfig = RoomListConfig[room.get_match_roomlevel()];
                if (levelConfig){
                    baseScore = Number(levelConfig.baseScore);
                }
            }

            //分数计算
            let src_player = room.get_player_by_seatid(body.srcseatid);
            let des_player = room.get_player_by_seatid(body.desseatid);
            if (src_player && des_player) {
                src_player.set_user_score(src_player.get_user_score() + baseScore);
                des_player.set_user_score(des_player.get_user_score() - baseScore);
                // Log.info("hcc>>playerScore: src_player:", src_player.get_unick(), "+1", " des_player:", des_player.get_unick(), "-1");
            }
            //发送分数
            GameFunction.send_player_score(room);

            //设置游戏状态为结算状态
            room.set_game_state(GameState.CheckOut);
            //发送玩家状态
            GameFunction.set_all_player_state(room, UserState.InView);
            GameFunction.broadcast_player_info_in_rooom(room);
            //清除上一局数据
            GameFunction.clear_all_player_cur_data(room);
            //发送权限
            GameFunction.send_player_power(room);
            //发送结算
            GameFunction.send_game_result(room);
            //大结算: 踢出所有玩家，房间解散
            if (room.get_play_count() == room.get_conf_play_count()) {
                await GameFunction.cal_player_chip_and_write(room); //计算金币,需要加await，不然会先执行下面的
                GameFunction.send_game_total_result(room);
                room.kick_all_player();
                roomMgr.delete_room(room.get_room_id());
            }
        }
    }
}

export default GameLogicInterface;