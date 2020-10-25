import Player from '../objects/Player';
import Log from '../../../utils/Log';
import Room from '../objects/Room';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import GameFunction from './GameFunction';
import GameHoodleConfig from '../config/GameHoodleConfig';
import Response from '../../protocol/Response';
import SendBaseInfo from './SendBaseInfo';

class SendLogicInfo extends SendBaseInfo {

    ////////////////////////////////////
    /////发送消息,游戏逻辑相关
    ////////////////////////////////////
    
    //发送玩家出生位置
    public static send_player_first_pos(room: Room, not_player?: Player, only_player?: Player) {
        if (!room) {
            return;
        }
        let player_set = room.get_all_player();
        let player_pos_array = [];
        let pos_index = 0;
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let pos = GameFunction.generate_start_pos(pos_index);
                // Log.info("hcc>>send_player_first_pos: ", pos);
                player.set_user_pos(pos);
                let player_pos = {
                    seatid: Number(player.get_seat_id()),
                    posx: String(pos.posx),
                    posy: String(pos.posy),
                }
                player_pos_array.push(player_pos);
                pos_index++;
            }
        }
        // Log.info("hcc>>send_player_first_pos array: ", player_pos_array);
        if (only_player) {
            only_player.send_cmd(GameHoodleProto.XY_ID.ePlayerFirstBallPosRes, { positions: player_pos_array });
        } else {
            let not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerFirstBallPosRes, { positions: player_pos_array }, not_uid);
        }
    }

    //发送玩家权限
    public static send_player_power(room: Room, not_player?: Player, only_player?: Player) {
        if (!room) {
            return;
        }
        let player_set = room.get_all_player();
        let player_power_array = [];
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let player_pos = {
                    seatid: Number(player.get_seat_id()),
                    power: Number(player.get_user_power()),
                }
                player_power_array.push(player_pos);
            }
        }

        if (only_player) {
            only_player.send_cmd(GameHoodleProto.XY_ID.ePlayerPowerRes, { status: Response.SUCCESS, powers: player_power_array });
        }
        else {
            let not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerPowerRes, { status: Response.SUCCESS, powers: player_power_array }, not_uid);
        }
    }

    //发送玩家射击 ,服务只做转发
    public static send_player_shoot(room: Room, shoot_info: any, not_uid: number) {
        if (!room || !shoot_info) {
            return;
        }
        let body = {
            status: Response.SUCCESS,
            seatid: Number(shoot_info.seatid),
            posx: String(shoot_info.posx),
            posy: String(shoot_info.posy),
            shootpower: Number(shoot_info.shootpower),
        }
        room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerShootRes, body, not_uid)
    }

    //发送玩家位置，球停下后
    public static send_player_ball_pos(room: Room, not_player?: Player, only_player?: Player) {
        if (!room) {
            return;
        }
        let player_set = room.get_all_player();
        let player_pos_array = [];
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let player_pos = {
                    seatid: Number(player.get_seat_id()),
                    posx: String(player.get_user_pos().posx),
                    posy: String(player.get_user_pos().posy),
                }
                player_pos_array.push(player_pos);
            }
        }
        if (only_player) {
            only_player.send_cmd(GameHoodleProto.XY_ID.ePlayerBallPosRes, { status: Response.SUCCESS, positions: player_pos_array });
        } else {
            let not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerBallPosRes, { status: Response.SUCCESS, positions: player_pos_array }, not_uid);
        }
    }

    //发送玩家射中 ，只做转发
    public static send_player_is_shooted(room: Room, shoot_info: any) {
        if (!room || !shoot_info) {
            return;
        }
        let body = {
            status: Response.SUCCESS,
            srcseatid: Number(shoot_info.srcseatid),
            desseatid: Number(shoot_info.desseatid),
        }
        room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerIsShootedRes, body);
    }

    //发送小结算
    public static send_game_result(room: Room) {
        if (!room) {
            return;
        }

        let player_set = room.get_all_player();
        let player_score_array = [];
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score()),
                }
                player_score_array.push(one_score);
            }
        }
        let body = {
            scores: player_score_array,
            isfinal: room.get_cur_play_count() == room.get_max_play_count(),
        }
        room.broadcast_in_room(GameHoodleProto.XY_ID.eGameResultRes, body);
    }

    //发送大结算
    public static send_game_total_result(room: Room) {
        if (!room) {
            return;
        }

        let player_set = room.get_all_player();
        let player_score_array = [];
        let player_golds_array = [];
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score()),
                }
                //金币不够情况
                let score = player.get_user_score();
                let gold_win = score * GameHoodleConfig.KW_WIN_RATE;
                let one_gold = {
                    seatid: Number(player.get_seat_id()),
                    gold: String(gold_win),
                }
                player_score_array.push(one_score);
                player_golds_array.push(one_gold);
            }
        }
        let body = {
            scores: player_score_array,
            golds: player_golds_array,
        }
        room.broadcast_in_room(GameHoodleProto.XY_ID.eTotalGameResultRes, body);
    }

    //发送玩家得分
    public static send_player_score(room: Room, not_player?: Player, only_player?: Player) {
        if (!room) {
            return;
        }

        let player_set = room.get_all_player();
        let player_score_array = [];
        for (let key in player_set) {
            let player: Player = player_set[key];
            if (player) {
                let one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score()),
                }
                player_score_array.push(one_score);
            }
        }

        if (only_player) {
            only_player.send_cmd(GameHoodleProto.XY_ID.ePlayerScoreRes, { scores: player_score_array });
        } else {
            let not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayerScoreRes, { scores: player_score_array }, not_uid);
        }
    }
}

export default SendLogicInfo;