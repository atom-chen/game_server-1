import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName } from '../protocol/SystemProto';
import SystemSend from './SystemSend';
import LoginRewardInterface from './interface/LoginRewardInterface';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class SystemModel {
    private static readonly Instance: SystemModel = new SystemModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [CommonProto.eUserLostConnectRes]: this.on_player_lost_connect,
            [Cmd.eLoginRewardConfigReq]: this.on_user_login_reward_config,
            [Cmd.eLoginRewardSignReq]: this.on_user_login_reward_sign,
        }
    }

    public static getInstance() {
        return SystemModel.Instance;
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

    on_user_login_reward_config(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            SystemSend.send(session, Cmd.eLoginRewardConfigRes, utag, proto_type,{status: Response.INVALIDI_OPT});
            return;
        }
        LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
    }

    on_user_login_reward_sign(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            SystemSend.send(session, Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response.INVALIDI_OPT });
            return;
        }
        LoginRewardInterface.do_user_login_reward_sign(session, utag, proto_type, raw_cmd);
    }
}

export default SystemModel;