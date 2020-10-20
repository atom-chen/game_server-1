//玩家使用表情
import Player from '../cell/Player';
import Log from '../../../utils/Log';
import Response from '../../protocol/Response';
import PlayerManager from '../manager/PlayerManager';
import ProtoManager from '../../../netbus/ProtoManager';
import GameCheck from './GameCheck';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import GameSendMsg from '../GameSendMsg';

let playerMgr: PlayerManager = PlayerManager.getInstance();

class GameEmojInterface {
    static async do_player_use_emoj(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let player:Player = playerMgr.get_player(utag);
        if(player){
            let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
            let resObj = {
                seatid: player.get_seat_id(),
                emojconfig: body.emojconfig,
            }

            let resBody = {
                status: Response.OK,
                emojconfig: JSON.stringify(resObj),
            }
            player.send_all(GameHoodleProto.XY_ID.eUserEmojRes, resBody);
        }
    }

}

export default GameEmojInterface;