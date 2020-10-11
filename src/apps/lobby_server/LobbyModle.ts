import Log from '../../utils/Log';
import ProtoManager from '../../netbus/ProtoManager';
import LobbyProto from '../protocol/protofile/LobbyProto';
import CommonProto from '../protocol/protofile/CommonProto';
import GameInfoHandle from './handle/GameInfoHandle';
import LobbySendMsg from './LobbySendMsg';
import Response from '../protocol/Response';
import RedisLobby from '../../database/RedisLobby';
import Stype from '../protocol/Stype';
import RoomHandle from './handle/RoomHandle';

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
            [LobbyProto.XY_ID.REQ_CERATEROOM]: this.on_req_create_room,
            [LobbyProto.XY_ID.REQ_JOINROOM]: this.on_req_join_room,
            [LobbyProto.XY_ID.REQ_EXITROOM]: this.on_req_exit_room,
            [LobbyProto.XY_ID.REQ_DESSOLVEROOM]: this.on_req_dessolve_room,
            [LobbyProto.XY_ID.REQ_BACKROOM]: this.on_req_back_room,
            [LobbyProto.XY_ID.REQ_ROOMSTATUS]: this.on_req_room_status,
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

    //玩家离开
    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
        
    }
    
    // 登录大厅
    // 同步玩家游戏服务数据，保存到redis
    // 同步房间列表
    on_req_login_lobby(session: any, utag: number, proto_type: number, raw_cmd: any) {
        GameInfoHandle.do_req_login_lobby(session, utag, proto_type, raw_cmd);
    }

    // 创建房间
    // 玩家是否存在
    // 是否已经创建了房间 or 已经卡在房间
    // 创建roomid ，并查询roomid是否存在
    // room解散之后，分配记录删除
    // 保存rooom 信息，server信息
    // 分配玩家进入哪个game_server，并记录分配值，以便玩家协议转入次server
    on_req_create_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        RoomHandle.do_req_create_room(session, utag, proto_type, raw_cmd);
    }
    
    //加入 OK 
    on_req_join_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        RoomHandle.do_req_join_room(session, utag, proto_type, raw_cmd);
    }

    //退出 OK 
    on_req_exit_room(session: any, utag: number, proto_type: number, raw_cmd: any){
        RoomHandle.do_req_exit_room(session, utag, proto_type, raw_cmd);
    }
    
    //返回 OK 
    on_req_back_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        RoomHandle.do_req_back_room(session, utag, proto_type, raw_cmd);
    }
    
    //解散 OK 
    on_req_dessolve_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        RoomHandle.do_req_dessolve_room(session, utag, proto_type, raw_cmd);
    }

    //查询玩家是否在房间内 OK 
    on_req_room_status(session: any, utag: number, proto_type: number, raw_cmd: any) {
        RoomHandle.do_req_room_status(session, utag, proto_type, raw_cmd);
    }
    
}

export default LobbyModle;