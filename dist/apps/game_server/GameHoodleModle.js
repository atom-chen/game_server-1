"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameLinkInterface_1 = __importDefault(require("./handler/GameLinkInterface"));
var GameProcessInterface_1 = __importDefault(require("./handler/GameProcessInterface"));
var GameLogicInterface_1 = __importDefault(require("./handler/GameLogicInterface"));
var GameEmojInterface_1 = __importDefault(require("./handler/GameEmojInterface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var GameHoodleProto_1 = __importDefault(require("../protocol/protofile/GameHoodleProto"));
var GameHoodleModle = /** @class */ (function () {
    function GameHoodleModle() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION] = this.on_player_lost_connect,
            _a[GameHoodleProto_1["default"].XY_ID.eLoginLogicReq] = this.on_player_login_logic_server,
            _a[GameHoodleProto_1["default"].XY_ID.eCheckLinkGameReq] = this.on_player_check_link_game,
            _a[GameHoodleProto_1["default"].XY_ID.eUserEmojReq] = this.on_player_use_emoj,
            _a[GameHoodleProto_1["default"].XY_ID.eUserReadyReq] = this.on_player_ready,
            _a[GameHoodleProto_1["default"].XY_ID.ePlayerShootReq] = this.on_player_shoot,
            _a[GameHoodleProto_1["default"].XY_ID.ePlayerBallPosReq] = this.on_player_ball_pos,
            _a[GameHoodleProto_1["default"].XY_ID.ePlayerIsShootedReq] = this.on_player_is_shooted,
            _a);
    }
    GameHoodleModle.getInstance = function () {
        return GameHoodleModle.Instance;
    };
    GameHoodleModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var cmdname = "";
        if (ctype == CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION) {
            cmdname = "lostconnect";
        }
        else {
            cmdname = GameHoodleProto_1["default"].XY_NAME[ctype];
        }
        Log_1["default"].info("recv_cmd_msg: ", Stype_1["default"].S_NAME[stype], cmdname, utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    //玩家离开逻辑服务
    GameHoodleModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        GameLinkInterface_1["default"].do_player_lost_connect(session, utag, proto_type, raw_cmd);
    };
    //登录逻辑服务
    GameHoodleModle.prototype.on_player_login_logic_server = function (session, utag, proto_type, raw_cmd) {
        GameLinkInterface_1["default"].do_player_login_logic_server(session, utag, proto_type, raw_cmd);
    };
    //进游戏房间后，服务推送房间内信息
    GameHoodleModle.prototype.on_player_check_link_game = function (session, utag, proto_type, raw_cmd) {
        GameProcessInterface_1["default"].do_player_check_link_game(session, utag, proto_type, raw_cmd);
    };
    //使用表情
    GameHoodleModle.prototype.on_player_use_emoj = function (session, utag, proto_type, raw_cmd) {
        GameEmojInterface_1["default"].do_player_use_emoj(session, utag, proto_type, raw_cmd);
    };
    //玩家准备
    GameHoodleModle.prototype.on_player_ready = function (session, utag, proto_type, raw_cmd) {
        GameProcessInterface_1["default"].do_player_ready(session, utag, proto_type, raw_cmd);
    };
    //玩家射击
    GameHoodleModle.prototype.on_player_shoot = function (session, utag, proto_type, raw_cmd) {
        GameLogicInterface_1["default"].do_player_shoot(session, utag, proto_type, raw_cmd);
    };
    //玩家位置信息
    GameHoodleModle.prototype.on_player_ball_pos = function (session, utag, proto_type, raw_cmd) {
        GameLogicInterface_1["default"].do_player_ball_pos(session, utag, proto_type, raw_cmd);
    };
    //玩家被射中
    GameHoodleModle.prototype.on_player_is_shooted = function (session, utag, proto_type, raw_cmd) {
        GameLogicInterface_1["default"].do_player_is_shooted(session, utag, proto_type, raw_cmd);
    };
    GameHoodleModle.Instance = new GameHoodleModle();
    return GameHoodleModle;
}());
exports["default"] = GameHoodleModle;
//# sourceMappingURL=GameHoodleModle.js.map