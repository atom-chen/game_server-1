//玩家使用表情
import Player from '../Player';
import { Cmd } from "../../../protocol/GameHoodleProto";
import Log from '../../../../utils/Log';
import MySqlGame from '../../../../database/MySqlGame';
import GameHoodleConfig from "../config/GameHoodleConfig";
import Response from '../../../protocol/Response';
import ArrayUtil from "../../../../utils/ArrayUtil";
import PlayerManager from '../PlayerManager';
import ProtoManager from '../../../../netbus/ProtoManager';
import GameCheck from './GameCheck';
import RoomManager from '../RoomManager';

let playerMgr: PlayerManager = PlayerManager.getInstance();
let roomMgr: RoomManager = RoomManager.getInstance();

class GamePlayAgainInterface {
    constructor(){

    }

    static do_player_play_again_req(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(), "do_player_play_again_req room is not exist!")
            return;
        }
        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            let resBody = {
                status:Response.OK,
                ansconfig: player.get_unick(),
            }
            player.send_cmd(Cmd.eUserPlayAgainRes,{status:Response.OK});
            room.broadcast_in_room(Cmd.eUserPlayAgainAnswerRes,resBody,player);
        }
    }

    static do_player_play_again_answer(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(), "do_player_play_again_answer room is not exist!")
            return;
        }
        
        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            let responsecode = body.responsecode;
            let resBody = {
                status:Response.OK,
                responsecode: responsecode,
            }
            room.broadcast_in_room(Cmd.eUserPlayAgainRes,resBody,player);
        }
    }

}

export default GamePlayAgainInterface;