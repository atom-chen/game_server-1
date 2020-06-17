import NetBus from "../../netbus/NetBus";
import { Stype } from '../protocol/Stype';

class RobotSend {
    
    //发给游戏服务
    public static send_game(session: any, ctype: number, utag: number, proto_type: number, body: any) {
        NetBus.send_cmd(session, Stype.GameSystem, ctype, utag, proto_type, body)
    }
 
    //发给账号服务
    public static send_auth(session: any, ctype: number, utag: number, proto_type: number, body: any) {
        NetBus.send_cmd(session, Stype.Auth, ctype, utag, proto_type, body)
    }

}

export default RobotSend;