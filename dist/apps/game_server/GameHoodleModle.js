"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameSendMsg_1 = __importDefault(require("./GameSendMsg"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var Response_1 = __importDefault(require("../protocol/Response"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameInfoInterface_1 = __importDefault(require("./interface/GameInfoInterface"));
var GameLinkInterface_1 = __importDefault(require("./interface/GameLinkInterface"));
var GameProcessInterface_1 = __importDefault(require("./interface/GameProcessInterface"));
var GameCheck_1 = __importDefault(require("./interface/GameCheck"));
var GameEmojInterface_1 = __importDefault(require("./interface/GameEmojInterface"));
var GameConfigInterface_1 = __importDefault(require("./interface/GameConfigInterface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var GameHoodleProto_1 = __importDefault(require("../protocol/protofile/GameHoodleProto"));
var GameHoodleModle = /** @class */ (function () {
    function GameHoodleModle() {
        var _a;
        this._cmd_handler_map = {};
        this._redis_handler_map = {};
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
        GameLinkInterface_1["default"].do_player_lost_connect(utag, proto_type, raw_cmd);
    };
    //登录逻辑服务
    GameHoodleModle.prototype.on_player_login_logic_server = function (session, utag, proto_type, raw_cmd) {
        GameLinkInterface_1["default"].do_player_login_logic_server(session, utag, proto_type, raw_cmd);
    };
    //进游戏房间后，服务推送房间内信息
    GameHoodleModle.prototype.on_player_check_link_game = function (session, utag, proto_type, raw_cmd) {
        GameProcessInterface_1["default"].do_player_check_link_game(session, utag, proto_type, raw_cmd);
    };
    //玩家准备
    GameHoodleModle.prototype.on_player_ready = function (session, utag, proto_type, raw_cmd) {
        GameProcessInterface_1["default"].do_player_ready(session, utag, proto_type, raw_cmd);
    };
    //玩家射击
    GameHoodleModle.prototype.on_player_shoot = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_shoot player is not exist!");
            return;
        }
        // GameLogicInterface.do_player_shoot(utag, proto_type, raw_cmd);
    };
    //玩家位置信息
    GameHoodleModle.prototype.on_player_ball_pos = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_ball_pos player is not exist!");
            return;
        }
        // GameLogicInterface.do_player_ball_pos(utag, proto_type, raw_cmd);
    };
    //玩家被射中
    GameHoodleModle.prototype.on_player_is_shooted = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_is_shooted player is not exist!");
            return;
        }
        // GameLogicInterface.do_player_is_shooted(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_match player is not exist!");
            return;
        }
        // GameMatchInterface.do_player_match(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_stop_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserStopMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_stop_match error player is not exist!");
            return;
        }
        // GameMatchInterface.do_player_stop_match(utag);
    };
    //游戏服信息,没有去创建，有就返回原来数据
    GameHoodleModle.prototype.on_player_get_ugame_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserGameInfoRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_user_match player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_ugame_info(utag);
    };
    //获取小球信息
    GameHoodleModle.prototype.on_player_get_ball_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserBallInfoRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_get_ball_info error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_ball_info(utag);
    };
    //更新小球信息,合成，卖掉，赠送等
    GameHoodleModle.prototype.on_player_update_ball_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUpdateUserBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_update_ball_info error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_update_ball_info(utag, proto_type, raw_cmd);
    };
    //请求商城列表
    GameHoodleModle.prototype.on_player_store_list = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eStoreListRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_store_list error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_store_list(utag);
    };
    GameHoodleModle.prototype.on_player_buy_things = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUpdateUserBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_buy_things error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_buy_things(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_use_hoodleball = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUseHoodleBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_use_hoodlebal error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_use_hoodleball(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_get_config = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserConfigRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_config error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_user_config(utag);
    };
    GameHoodleModle.prototype.on_player_use_emoj = function (session, utag, proto_type, raw_cmd) {
        GameEmojInterface_1["default"].do_player_use_emoj(session, utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_play_again_req = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserPlayAgainRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_play_again_req error player is not exist!");
            return;
        }
        // GamePlayAgainInterface.do_player_play_again_req(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_play_again_answer = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserPlayAgainAnswerRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_play_again_answer error player is not exist!");
            return;
        }
        // GamePlayAgainInterface.do_player_play_again_answer(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_room_list_req = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eRoomListConfigRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_room_list_req error player is not exist!");
            return;
        }
        GameConfigInterface_1["default"].do_player_room_list_req(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.Instance = new GameHoodleModle();
    return GameHoodleModle;
}());
exports["default"] = GameHoodleModle;
//# sourceMappingURL=GameHoodleModle.js.map