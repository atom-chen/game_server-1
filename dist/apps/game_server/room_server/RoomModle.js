"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleProto_1 = require("../../protocol/protofile/GameHoodleProto");
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var RoomModle = /** @class */ (function () {
    function RoomModle() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[GameHoodleProto_1.Cmd.eCheckLinkGameReq] = this.on_player_check_link_game,
            _a);
    }
    RoomModle.getInstance = function () {
        return RoomModle.Instance;
    };
    RoomModle.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    RoomModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("hcc>>recv_cmd_msg: ", stype, ctype, utag, proto_type, body);
        //NetServer.send_encoded_cmd(session,raw_cmd);
        // let player: Player = PlayerManager.getInstance().get_player(utag);
        // let unick = "none";
        // if (player) {
        //     unick = player.get_unick();
        // }
        // let cmdname = "";
        // if (ctype == 10000) {
        //     cmdname = "lostconnect"
        // } else {
        //     cmdname = CmdName[ctype];
        // }
        // Log.info("recv_cmd_msg: ", StypeName[stype], cmdname, utag, unick);
        // if (this._cmd_handler_map[ctype]) {
        //     this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        // }
    };
    //玩家离开逻辑服务
    RoomModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    //进游戏房间后，服务推送房间内信息
    RoomModle.prototype.on_player_check_link_game = function (session, utag, proto_type, raw_cmd) {
        // if (!GameCheck.check_player(utag)) {
        //     Log.warn("check_link_game player is not exist!")
        //     GameSendMsg.send(session, Cmd.eCheckLinkGameRes, utag, proto_type, { status: Response.INVALIDI_OPT })
        //     return;
        // }
        // GameProcessInterface.do_player_check_link_game(utag);
    };
    RoomModle.Instance = new RoomModle();
    return RoomModle;
}());
exports["default"] = RoomModle;
//# sourceMappingURL=RoomModle.js.map