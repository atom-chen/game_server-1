"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../utils/Log"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var LobbyProto_1 = __importDefault(require("../protocol/protofile/LobbyProto"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var GameInfoHandle_1 = __importDefault(require("./handle/GameInfoHandle"));
var RoomHandle_1 = __importDefault(require("./handle/RoomHandle"));
/**
 * 房间号，玩家ID，游戏逻辑进程ID，
 */
var LobbyModle = /** @class */ (function () {
    function LobbyModle() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION] = this.on_player_lost_connect,
            _a[LobbyProto_1["default"].XY_ID.REQ_LOGINLOBBY] = this.on_req_login_lobby,
            _a[LobbyProto_1["default"].XY_ID.REQ_CERATEROOM] = this.on_req_create_room,
            _a[LobbyProto_1["default"].XY_ID.REQ_JOINROOM] = this.on_req_join_room,
            _a[LobbyProto_1["default"].XY_ID.REQ_EXITROOM] = this.on_req_exit_room,
            _a[LobbyProto_1["default"].XY_ID.REQ_DESSOLVEROOM] = this.on_req_dessolve_room,
            _a[LobbyProto_1["default"].XY_ID.REQ_BACKROOM] = this.on_req_back_room,
            _a[LobbyProto_1["default"].XY_ID.REQ_ROOMSTATUS] = this.on_req_room_status,
            _a);
    }
    LobbyModle.getInstance = function () {
        return LobbyModle.Instance;
    };
    LobbyModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("hcc>>Lobby>>recv_cmd_msg: ", stype, ctype, utag, proto_type, body);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    //玩家离开
    LobbyModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    // 登录大厅
    // 同步玩家游戏服务数据，保存到redis
    // 同步房间列表
    LobbyModle.prototype.on_req_login_lobby = function (session, utag, proto_type, raw_cmd) {
        GameInfoHandle_1["default"].do_req_login_lobby(session, utag, proto_type, raw_cmd);
    };
    // 创建房间
    // 玩家是否存在
    // 是否已经创建了房间 or 已经卡在房间
    // 创建roomid ，并查询roomid是否存在
    // room解散之后，分配记录删除
    // 保存rooom 信息，server信息
    // 分配玩家进入哪个game_server，并记录分配值，以便玩家协议转入次server
    LobbyModle.prototype.on_req_create_room = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_create_room(session, utag, proto_type, raw_cmd);
    };
    //加入 OK 
    LobbyModle.prototype.on_req_join_room = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_join_room(session, utag, proto_type, raw_cmd);
    };
    //退出 OK 
    LobbyModle.prototype.on_req_exit_room = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_exit_room(session, utag, proto_type, raw_cmd);
    };
    //返回 OK 
    LobbyModle.prototype.on_req_back_room = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_back_room(session, utag, proto_type, raw_cmd);
    };
    //解散 OK 
    LobbyModle.prototype.on_req_dessolve_room = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_dessolve_room(session, utag, proto_type, raw_cmd);
    };
    //查询玩家是否在房间内 OK 
    LobbyModle.prototype.on_req_room_status = function (session, utag, proto_type, raw_cmd) {
        RoomHandle_1["default"].do_req_room_status(session, utag, proto_type, raw_cmd);
    };
    LobbyModle.Instance = new LobbyModle();
    return LobbyModle;
}());
exports["default"] = LobbyModle;
//# sourceMappingURL=LobbyModle.js.map