//配置信息
import Player from '../cell/Player';
import { Cmd } from "../../../protocol/GameHoodleProto";
import Response from '../../../protocol/Response';
import PlayerManager from '../manager/PlayerManager';
import { RoomListConfig } from '../config/RoomListConfig';
import Log from '../../../../utils/Log';

let playerMgr: PlayerManager = PlayerManager.getInstance();

class GameConfigInterface {

    static do_player_room_list_req(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        let config = JSON.stringify(RoomListConfig);
        let body = {
            status : Response.OK,
            config : config,
        }
        // Log.info("hcc>>do_player_room_list_req: " , body);
        player.send_cmd(Cmd.eRoomListConfigRes,body);
    }
}

export default GameConfigInterface;