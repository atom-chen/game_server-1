import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/protofile/CommonProto';
import Log from '../../utils/Log';
import SystemSend from './SystemSend';
import LoginRewardInterface from './interface/LoginRewardInterface';
import ShareInterface from './interface/ShareInterface';
import AddUchipInterface from './interface/AddUchipInterface';
import Stype from '../protocol/Stype';
import SystemProto from '../protocol/protofile/SystemProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class SystemModel {
    private static readonly Instance: SystemModel = new SystemModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]: this.on_player_lost_connect,
            [SystemProto.XY_ID.REQ_LOGINREWARDCONFIG]: this.on_user_login_reward_config,
            [SystemProto.XY_ID.REQ_LOGINREWARDSIGN]: this.on_user_login_reward_sign,
            [SystemProto.XY_ID.REQ_USERSHARE]: this.on_user_share_req,
            [SystemProto.XY_ID.REQ_USERADDCHIP]: this.on_user_add_chip_req,
        }
    }

    public static getInstance() {
        return SystemModel.Instance;
    }

    private decode_cmd(proto_type: number, raw_cmd: any) {
        return ProtoManager.decode_cmd(proto_type, raw_cmd);
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        let ctypeName = ctype == CommonProto.XY_ID.PUSH_USERLOSTCONNECTION ? "UserLostConnectRes" : SystemProto.XY_NAME[ctype];
        Log.info("recv_cmd_msg: stype:", Stype.S_NAME[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag)
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
            SystemSend.send(session, SystemProto.XY_ID.RES_LOGINREWARDCONFIG, utag, proto_type,{status: Response.INVALIDI_OPT});
            return;
        }
        LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
    }

    on_user_login_reward_sign(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            SystemSend.send(session, SystemProto.XY_ID.RES_LOGINREWARDSIGN, utag, proto_type, { status: Response.INVALIDI_OPT });
            return;
        }
        LoginRewardInterface.do_user_login_reward_sign(session, utag, proto_type, raw_cmd);
    }

    on_user_share_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if(utag == 0){
            SystemSend.send(session, SystemProto.XY_ID.RES_USERSHARE, utag, proto_type, { status: Response.INVALIDI_OPT });
            return;
        }
        ShareInterface.dn_user_share_req(session, utag, proto_type, raw_cmd);
    }

    on_user_add_chip_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            SystemSend.send(session, SystemProto.XY_ID.RES_USERADDCHIP, utag, proto_type, { status: Response.INVALIDI_OPT });
            return;
        }

        AddUchipInterface.do_user_add_chip_req(session, utag, proto_type, raw_cmd);
    }
}

export default SystemModel;