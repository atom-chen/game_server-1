import { Stype } from '../protocol/Stype';
import ProtoTools from '../../netbus/ProtoTools';
import NetClient from "../../netbus/NetClient";

class RobotSend {

    //发给游戏服务,这个服务，是需要自己先连接gateway，当前属于客户端
    public static send_game(server_session:any, ctype: number, utag: number, body?: any) {
        NetClient.send_cmd(server_session, Stype.GameHoodle, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
    }

    //发送给auth服务
    public static send_auth(server_session:any, ctype:number, utag:number, body?:any){
        NetClient.send_cmd(server_session, Stype.Auth, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
    }

}

export default RobotSend;