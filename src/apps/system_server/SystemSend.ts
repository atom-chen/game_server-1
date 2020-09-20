import NetServer from "../../netbus/NetServer";
import Stype from '../protocol/Stype';

class SystemSend {
    public static send(session: any, ctype: number, utag: number, proto_type: number, body: any) {
        NetServer.send_cmd(session, Stype.S_TYPE.System, ctype, utag, proto_type, body)
    }
}

export default SystemSend;