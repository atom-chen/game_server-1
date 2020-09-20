import Log from '../../utils/Log';
import ProtoManager from '../../netbus/ProtoManager';
import LobbyProto from '../protocol/protofile/LobbyProto';
import CommonProto from '../protocol/protofile/CommonProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

/**
 * 房间号，玩家ID，游戏逻辑进程ID，
 */
class LobbyModle {
    private static readonly Instance: LobbyModle = new LobbyModle();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]: this.on_player_lost_connect,
            [LobbyProto.XY_ID.REQ_LOGINLOBBY]: this.on_req_login_lobby,
        }
    }

    public static getInstance() {
        return LobbyModle.Instance;
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        Log.info("hcc>>Lobby>>recv_cmd_msg: " , stype, ctype, utag, proto_type, body);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    //玩家离开逻辑服务
    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
    }
    
    //进游戏房间后，服务推送房间内信息
    on_req_login_lobby(session: any, utag: number, proto_type: number, raw_cmd: any) {
    }

}

export default LobbyModle;