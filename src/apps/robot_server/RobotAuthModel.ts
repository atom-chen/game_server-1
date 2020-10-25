import Response from '../protocol/Response';
import ProtoManager from '../../netengine/ProtoManager';
import Log from '../../utils/Log';
import RobotGameInterface from './interface/RobotGameInterface';
import RobotSend from './RobotSend';
import Stype from '../protocol/Stype';
import AuthProto from '../protocol/protofile/AuthProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class RobotAuthModel {
    private static readonly Instance: RobotAuthModel = new RobotAuthModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [AuthProto.XY_ID.REQ_GUESTLOGIN]: this.on_guest_login_auth_res,
        }
    }

    public static getInstance() {
        return RobotAuthModel.Instance;
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        Log.info("recv_cmd_msg: stype:", Stype.S_NAME[stype], " ,cmdName: ", AuthProto.XY_NAME[ctype], " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    private on_guest_login_auth_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer){
        Log.info("hcc>>on_guest_login_auth_res.....,utag: ", utag);
        let body = ProtoManager.decode_cmd(proto_type,raw_cmd);
        if(body){
            let status = body.status;
            if (Response.SUCCESS == status){
                RobotGameInterface.robot_login_logic_server(session, utag);
            }else{
                Log.info("hcc>>on_guest_login_auth_res login auth failed..");
            }
        }
    }
}

export default RobotAuthModel;