import NetServer from "../../netbus/NetServer";
import { Stype } from "../protocol/Stype";

class RoomSendMsg {
    //发协议给session客户端
    public static send_client(session: any, ctype: number, utag: number, proto_type: number, body: any) {
        NetServer.send_cmd(session, Stype.Lobby, ctype, utag, proto_type, body)
    }

    //发给服务
    public static send_server(){

    }
}

export default RoomSendMsg;