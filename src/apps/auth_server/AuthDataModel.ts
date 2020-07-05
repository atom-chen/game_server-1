import ProtoManager from '../../netbus/ProtoManager';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName } from '../protocol/DataBaseProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class AuthDataModel {
    private static readonly Instance: AuthDataModel = new AuthDataModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor(){
        this._cmd_handler_map = {
            [CommonProto.eUserLostConnectRes]:      this.on_player_lost_connect,
            [Cmd.eAuthUinfoRes]:                   this.on_auth_uinfo_res

        }
    }

    public static getInstance(){
        return AuthDataModel.Instance;
    }

    private decode_cmd(proto_type:number,raw_cmd:any){
        return ProtoManager.decode_cmd(proto_type,raw_cmd);
    }

    public recv_cmd_msg(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:Buffer){
        Log.info("recv_cmd_msg: ", stype, ctype, utag, proto_type, ProtoManager.decode_cmd(proto_type, raw_cmd))
        let ctypeName = ctype == CommonProto.eUserLostConnectRes ? "UserLostConnectRes" : CmdName[ctype];
        Log.info("recv_cmd_msg: stype:", StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ",utag)
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }
    
    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = this.decode_cmd(proto_type, raw_cmd);
        Log.info("on_player_lost_connect utag:", utag, body)
    }

    on_auth_uinfo_res(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (utag == 0) {
            return;
        }
    }
}

export default AuthDataModel;