import NetBus from "../../netbus/NetBus";
import { Stype } from '../protocol/Stype';

class RobotSend {

    //发给游戏服务
    public static send_game( ctype: number, utag: number, proto_type: number, body: any) {
        let game_server_session = NetBus.get_server_session(Stype.GameHoodle);
        NetBus.send_cmd(game_server_session, Stype.GameHoodle, ctype, utag, proto_type, body);
    }

}

export default RobotSend;