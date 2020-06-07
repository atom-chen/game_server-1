import NetBus from "../../netbus/NetBus";
import { Stype } from '../protocol/Stype';

class SystemSend {
    public static send(session: any, ctype: number, utag: number, proto_type: number, body: any) {
        NetBus.send_cmd(session, Stype.GameSystem, ctype, utag, proto_type, body)
    }
}

export default SystemSend;