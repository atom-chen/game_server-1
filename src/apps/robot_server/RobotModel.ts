import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName} from '../protocol/RobotProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class RobotModel {
    private static readonly Instance: RobotModel = new RobotModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [CommonProto.eUserLostConnectRes]: this.on_player_lost_connect,
            // [Cmd.eLoginRewardConfigReq]: this.on_user_login_reward_config,
        }
    }

    public static getInstance() {
        return RobotModel.Instance;
    }

    private decode_cmd(proto_type: number, raw_cmd: any) {
        return ProtoManager.decode_cmd(proto_type, raw_cmd);
    }

    //session tcp session
    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        let ctypeName = ctype == CommonProto.eUserLostConnectRes ? "UserLostConnectRes" : CmdName[ctype];
        Log.info("recv_cmd_msg: stype:", StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag , " ,data:", this.decode_cmd(proto_type, raw_cmd));
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = this.decode_cmd(proto_type, raw_cmd);
        Log.info("on_player_lost_connect utag:", utag, body)
    }

}

export default RobotModel;