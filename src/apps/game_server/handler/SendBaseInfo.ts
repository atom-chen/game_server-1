import Player from '../objects/Player';
import Log from '../../../utils/Log';
import Room from '../objects/Room';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import ArrayUtil from '../../../utils/ArrayUtil';
import Response from '../../protocol/Response';

export default class SendBaseInfo {
    ////////////////////////////////////////
    ///发送基本信息
    ////////////////////////////////////////
    //向房间内所有人发送局内玩家信息
    static broadcast_player_info_in_rooom(room: Room, not_uid?: number) {
        if (!room) {
            return;
        }
        let player_set = room.get_all_player();
        let userinfo_array = [];
        try {
            for (let key in player_set) {
                let player: Player = player_set[key];
                if (player) {
                    let userinfo = {
                        numberid: String(player.get_numberid()),
                        userinfostring: JSON.stringify(player.get_player_info()),
                    }
                    userinfo_array.push(userinfo);
                }
            }
            room.broadcast_in_room(GameHoodleProto.XY_ID.eUserInfoRes, { userinfo: userinfo_array }, not_uid);
        } catch (error) {
            Log.error(error);
        }
    }

    //向某个玩家发送局内玩家信息
    static async send_player_info(player: Player) {
        if (!player) {
            return;
        }
        let room = await player.get_room();
        if (!room) {
            return;
        }

        let player_set = room.get_all_player();
        if (ArrayUtil.GetArrayLen(player_set) <= 0) {
            return;
        }

        let userinfo_array = [];
        try {
            for (let key in player_set) {
                let player = player_set[key];
                if (player) {
                    let userinfo = {
                        numberid: String(player.get_numberid()),
                        userinfostring: JSON.stringify(player.get_player_info()),
                    }
                    userinfo_array.push(userinfo);
                }
            }
            player.send_cmd(GameHoodleProto.XY_ID.eUserInfoRes, { userinfo: userinfo_array });
        } catch (error) {
            Log.error(error);
        }
    }

    //向房间内所有人发送某玩家准备的消息
    static send_player_state(room: Room, src_player: Player, not_to_player?: Player) {
        let body = {
            status: Response.SUCCESS,
            seatid: Number(src_player.get_seat_id()),
            userstate: Number(src_player.get_user_state()),
        }
        let not_uid = not_to_player ? not_to_player.get_uid() : undefined;
        room.broadcast_in_room(GameHoodleProto.XY_ID.eUserReadyRes, body, not_uid);
    }

    //发送局数
    static send_play_count(room: Room, not_to_player?: Player) {
        let body = {
            playcount: String(room.get_cur_play_count()),
            totalplaycount: String(room.get_max_play_count()),
        }
        let not_uid = not_to_player ? not_to_player.get_uid() : undefined;
        room.broadcast_in_room(GameHoodleProto.XY_ID.ePlayCountRes, body, not_uid);
    }

    //发送小结算
    public static send_game_result(room: Room) {

    }

    //发送大结算
    public static send_game_total_result(room: Room) {

    }
}