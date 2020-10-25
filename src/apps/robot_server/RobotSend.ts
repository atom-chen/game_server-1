import ProtoTools from '../../netengine/ProtoTools';
import NetClient from "../../netengine/NetClient";
import Stype from '../protocol/Stype';

class RobotSend {

    //发给游戏服务,这个服务，是需要自己先连接gateway，当前属于客户端
    public static send_game(server_session:any, ctype: number, utag: number, body?: any) {
        NetClient.send_cmd(server_session, Stype.S_TYPE.GameHoodle, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
    }

    //发送给auth服务
    public static send_auth(server_session:any, ctype:number, utag:number, body?:any){
        NetClient.send_cmd(server_session, Stype.S_TYPE.Auth, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
    }

}

export default RobotSend;