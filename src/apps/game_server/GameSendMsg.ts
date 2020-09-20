import NetServer from '../../netbus/NetServer';
import Stype from '../protocol/Stype';

class GameSendMsg {
    //发协议给session客户端
    public static send(session:any, ctype:number, utag:number, proto_type:number, body:any){
        NetServer.send_cmd(session, Stype.S_TYPE.GameHoodle, ctype, utag, proto_type, body)
    }
}

export default GameSendMsg;