"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../utils/Log"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var LobbyProto_1 = __importDefault(require("../protocol/protofile/LobbyProto"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
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
    //玩家离开逻辑服务
    LobbyModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    //进游戏房间后，服务推送房间内信息
    LobbyModle.prototype.on_req_login_lobby = function (session, utag, proto_type, raw_cmd) {
    };
    LobbyModle.Instance = new LobbyModle();
    return LobbyModle;
}());
exports["default"] = LobbyModle;
//# sourceMappingURL=LobbyModle.js.map