import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName } from '../protocol/RobotProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class RobotModel {
    private static readonly Instance: RobotModel = new RobotModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [Cmd.eLoginLogicRes]: this.on_player_login_logic_res,
        }
    }

    public static getInstance() {
        return RobotModel.Instance;
    }

    private decode_cmd(proto_type: number, raw_cmd: any) {
        return ProtoManager.decode_cmd(proto_type, raw_cmd);
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        Log.info("recv_cmd_msg: stype:", StypeName[stype], " ,cmdName: ", CmdName[ctype], " ,utag: ", utag , " ,data:", this.decode_cmd(proto_type, raw_cmd));
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    private on_player_login_logic_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer){
        Log.info("hcc>>on_player_login_logic_res.....");
    }
}

export default RobotModel;