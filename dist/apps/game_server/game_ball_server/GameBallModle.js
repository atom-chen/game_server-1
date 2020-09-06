"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameBallModle = /** @class */ (function () {
    function GameBallModle() {
        this._cmd_handler_map = {};
        this._cmd_handler_map = {
        // [CommonProto.eUserLostConnectRes]: this.on_player_lost_connect, //hall
        // [Cmd.eLoginLogicReq]: this.on_player_login_logic_server, //hall
        // [Cmd.eCreateRoomReq]: this.on_player_create_room, //hall
        // [Cmd.eJoinRoomReq]: this.on_player_join_room, //hall
        // [Cmd.eExitRoomReq]: this.on_player_exit_room, //hall
        // [Cmd.eDessolveReq]: this.on_player_dessolve_room, //hall
        // [Cmd.eGetRoomStatusReq]: this.on_player_get_room_status, //hall
        // [Cmd.eBackRoomReq]: this.on_player_back_room, //hall
        // [Cmd.eCheckLinkGameReq]: this.on_player_check_link_game, //game
        // [Cmd.eUserReadyReq]: this.on_player_ready, //game
        // [Cmd.ePlayerShootReq]: this.on_player_shoot, //game
        // [Cmd.ePlayerBallPosReq]: this.on_player_ball_pos, //game
        // [Cmd.ePlayerIsShootedReq]: this.on_player_is_shooted, //game
        // [Cmd.eUserMatchReq]: this.on_player_match, //game match
        // [Cmd.eUserStopMatchReq]: this.on_player_stop_match, //game match
        // [Cmd.eUserGameInfoReq]: this.on_player_get_ugame_info, // hall
        // [Cmd.eUserBallInfoReq]: this.on_player_get_ball_info, //hall
        // [Cmd.eUpdateUserBallReq]: this.on_player_update_ball_info, //hall
        // [Cmd.eStoreListReq]: this.on_player_store_list, //hall
        // [Cmd.eBuyThingsReq]: this.on_player_buy_things, //hall
        // [Cmd.eUserConfigReq]: this.on_player_get_config, //hall
        // [Cmd.eUseHoodleBallReq]: this.on_player_use_hoodleball, //hall
        // [Cmd.eUserEmojReq]: this.on_player_use_emoj, //game
        // [Cmd.eUserPlayAgainReq]: this.on_player_play_again_req, //game
        // [Cmd.eUserPlayAgainAnswerReq]: this.on_player_play_again_answer, //game
        // [Cmd.eRoomListConfigReq]: this.on_player_room_list_req,//hall
        };
    }
    GameBallModle.getInstance = function () {
        return GameBallModle.Instance;
    };
    GameBallModle.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    GameBallModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("hcc>>recv_cmd_msg: ", stype, ctype, utag, proto_type, body);
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
    GameBallModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    GameBallModle.Instance = new GameBallModle();
    return GameBallModle;
}());
exports["default"] = GameBallModle;
//# sourceMappingURL=GameBallModle.js.map