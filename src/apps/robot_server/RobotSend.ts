import NetBus from "../../netbus/NetBus";
import { Stype } from '../protocol/Stype';
import ProtoTools from '../../netbus/ProtoTools';

class RobotSend {

    //发给游戏服务,这个服务，是需要自己先连接上的，当前属于客户端
    public static send_game( ctype: number, utag: number, body?: any) {
        let game_server_session = NetBus.get_server_session(Stype.GameHoodle);
        if (game_server_session){
            NetBus.send_cmd(game_server_session, Stype.GameHoodle, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
        }
    }

}

export default RobotSend;