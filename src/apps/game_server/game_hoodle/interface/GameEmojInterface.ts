//玩家使用表情
import Player from '../Player';
import { Cmd } from "../../../protocol/GameHoodleProto";
import Log from '../../../../utils/Log';
import Response from '../../../protocol/Response';
import PlayerManager from '../PlayerManager';
import ProtoManager from '../../../../netbus/ProtoManager';
import RoomManager from '../RoomManager';
import GameCheck from './GameCheck';

let playerMgr: PlayerManager = PlayerManager.getInstance();
let roomMgr: RoomManager = RoomManager.getInstance();

class GameEmojInterface {
    constructor(){

    }

    static do_player_use_emoj(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        if (!GameCheck.check_room(utag)) {
            Log.warn(player.get_unick(), "do_player_use_emoj room is not exist!")
            return;
        }

        let room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            let resObj = {
                seatid:player.get_seat_id(),
                emojconfig : body.emojconfig,
            }

            let resBody = {
                status:Response.OK,
                emojconfig: JSON.stringify(resObj),
            }
            room.broadcast_in_room(Cmd.eUserEmojRes,resBody);
        }
    }

}

export default GameEmojInterface;