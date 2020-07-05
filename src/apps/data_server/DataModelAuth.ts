
import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName } from '../protocol/DataBaseProto';
import DataSend from './DataSend';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class DataModelAuth {
    private static readonly Instance: DataModelAuth = new DataModelAuth();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [CommonProto.eUserLostConnectRes]: this.on_player_lost_connect,
            [Cmd.eAuthUinfoReq]: this.on_player_get_auth_info,
        }
    }

    public static getInstance() {
        return DataModelAuth.Instance;
    }

    private decode_cmd(proto_type: number, raw_cmd: any) {
        return ProtoManager.decode_cmd(proto_type, raw_cmd);
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        let ctypeName = ctype == CommonProto.eUserLostConnectRes ? "UserLostConnectRes" : CmdName[ctype];
        Log.info("recv_cmd_msg: stype:", StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag)
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = this.decode_cmd(proto_type, raw_cmd);
        Log.info("on_player_lost_connect utag:", utag, body)
    }

    on_player_get_auth_info(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = this.decode_cmd(proto_type, raw_cmd);
        Log.info("on_player_get_auth_info utag:", utag, body);
        let res_body = {
            status: Response.OK,
            result: "success!!",
        }
        DataSend.send_cmd(session, Cmd.eAuthUinfoRes, utag, res_body);
    }

}

export default DataModelAuth;