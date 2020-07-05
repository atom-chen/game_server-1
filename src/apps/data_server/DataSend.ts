import NetClient from "../../netbus/NetClient";
import { Stype } from "../protocol/Stype";
import ProtoTools from "../../netbus/ProtoTools";

class DataSend {

    //发给游戏服务
    //当前属于服务端，client_session: game_server的session
    public static send_cmd(client_session: any, ctype: number, utag: number, body?: any) {
        NetClient.send_cmd(client_session, Stype.DataBase, ctype, utag, ProtoTools.ProtoType.PROTO_BUF, body);
    }
}

export default DataSend;