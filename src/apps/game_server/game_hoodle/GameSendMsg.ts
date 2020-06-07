import NetBus from '../../../netbus/NetBus';
import { Stype } from '../../protocol/Stype';

class GameSendMsg {
    //发协议给session客户端
    public static send(session:any, ctype:number, utag:number, proto_type:number, body:any){
        NetBus.send_cmd(session, Stype.GameHoodle, ctype, utag, proto_type, body)
    }

    //模拟客户端发协给当前服务//TODO
    public static send_simulate_client(ctype:number, utag:number, proto_type:number , body:any){
        // let server_session = NetBus.get_server_session(Stype.GameHoodle);
        // if (server_session){
        //     NetBus.send_cmd(server_session, Stype.GameHoodle, ctype, utag, proto_type, body);
        // }
    }
}

export default GameSendMsg;