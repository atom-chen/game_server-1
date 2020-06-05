"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var GameHoodleProto_1 = require("../../protocol/GameHoodleProto");
var GameSendMsg_1 = __importDefault(require("./GameSendMsg"));
var CommonProto_1 = __importDefault(require("../../protocol/CommonProto"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameInfoInterface_1 = __importDefault(require("./interface/GameInfoInterface"));
var GameLinkInterface_1 = __importDefault(require("./interface/GameLinkInterface"));
var GameRoomInterface_1 = __importDefault(require("./interface/GameRoomInterface"));
var GameMatchInterface_1 = __importDefault(require("./interface/GameMatchInterface"));
var GameProcessInterface_1 = __importDefault(require("./interface/GameProcessInterface"));
var GameLogicInterface_1 = __importDefault(require("./interface/GameLogicInterface"));
var GameCheck_1 = __importDefault(require("./interface/GameCheck"));
var GameEmojInterface_1 = __importDefault(require("./interface/GameEmojInterface"));
var GamePlayAgainInterface_1 = __importDefault(require("./interface/GamePlayAgainInterface"));
var GameConfigInterface_1 = __importDefault(require("./interface/GameConfigInterface"));
var GameHoodleModle = /** @class */ (function () {
    function GameHoodleModle() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].eUserLostConnectRes] = this.on_player_lost_connect,
            _a[GameHoodleProto_1.Cmd.eLoginLogicReq] = this.on_player_login_logic_server,
            _a[GameHoodleProto_1.Cmd.eCreateRoomReq] = this.on_player_create_room,
            _a[GameHoodleProto_1.Cmd.eJoinRoomReq] = this.on_player_join_room,
            _a[GameHoodleProto_1.Cmd.eExitRoomReq] = this.on_player_exit_room,
            _a[GameHoodleProto_1.Cmd.eDessolveReq] = this.on_player_dessolve_room,
            _a[GameHoodleProto_1.Cmd.eGetRoomStatusReq] = this.on_player_get_room_status,
            _a[GameHoodleProto_1.Cmd.eBackRoomReq] = this.on_player_back_room,
            _a[GameHoodleProto_1.Cmd.eCheckLinkGameReq] = this.on_player_check_link_game,
            _a[GameHoodleProto_1.Cmd.eUserReadyReq] = this.on_player_ready,
            _a[GameHoodleProto_1.Cmd.ePlayerShootReq] = this.on_player_shoot,
            _a[GameHoodleProto_1.Cmd.ePlayerBallPosReq] = this.on_player_ball_pos,
            _a[GameHoodleProto_1.Cmd.ePlayerIsShootedReq] = this.on_player_is_shooted,
            _a[GameHoodleProto_1.Cmd.eUserMatchReq] = this.on_player_match,
            _a[GameHoodleProto_1.Cmd.eUserStopMatchReq] = this.on_player_stop_match,
            _a[GameHoodleProto_1.Cmd.eUserGameInfoReq] = this.on_player_get_ugame_info,
            _a[GameHoodleProto_1.Cmd.eUserBallInfoReq] = this.on_player_get_ball_info,
            _a[GameHoodleProto_1.Cmd.eUpdateUserBallReq] = this.on_player_update_ball_info,
            _a[GameHoodleProto_1.Cmd.eStoreListReq] = this.on_player_store_list,
            _a[GameHoodleProto_1.Cmd.eBuyThingsReq] = this.on_player_buy_things,
            _a[GameHoodleProto_1.Cmd.eUserConfigReq] = this.on_player_get_config,
            _a[GameHoodleProto_1.Cmd.eUseHoodleBallReq] = this.on_player_use_hoodleball,
            _a[GameHoodleProto_1.Cmd.eUserEmojReq] = this.on_player_use_emoj,
            _a[GameHoodleProto_1.Cmd.eUserPlayAgainReq] = this.on_player_play_again_req,
            _a[GameHoodleProto_1.Cmd.eUserPlayAgainAnswerReq] = this.on_player_play_again_answer,
            _a[GameHoodleProto_1.Cmd.eRoomListConfigReq] = this.on_player_room_list_req,
            _a);
    }
    GameHoodleModle.getInstance = function () {
        return GameHoodleModle.Instance;
    };
    GameHoodleModle.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        Log_1["default"].info("recv_cmd_msg: ", stype, ctype, utag, proto_type, this.decode_cmd(proto_type, raw_cmd));
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    //玩家离开逻辑服务
    GameHoodleModle.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            return;
        }
        GameLinkInterface_1["default"].do_player_lost_connect(utag);
    };
    //登录逻辑服务
    GameHoodleModle.prototype.on_player_login_logic_server = function (session, utag, proto_type, raw_cmd) {
        GameLinkInterface_1["default"].do_player_login_logic_server(session, utag, proto_type);
    };
    //创建房间
    GameHoodleModle.prototype.on_player_create_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("create_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameRoomInterface_1["default"].do_player_create_room(utag, proto_type, raw_cmd);
    };
    //加入房间
    GameHoodleModle.prototype.on_player_join_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("join_room error, player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameRoomInterface_1["default"].do_player_join_room(utag, proto_type, raw_cmd);
    };
    //离开房间
    GameHoodleModle.prototype.on_player_exit_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("exit_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eExitRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameRoomInterface_1["default"].do_player_exit_room(utag);
    };
    //解散房间
    GameHoodleModle.prototype.on_player_dessolve_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("dessolve_room error, player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameRoomInterface_1["default"].do_player_dessolve_room(utag);
    };
    //获取是否创建过房间
    GameHoodleModle.prototype.on_player_get_room_status = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("get_room_status player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eGetRoomStatusRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
            return;
        }
        GameRoomInterface_1["default"].do_player_get_room_status(utag);
    };
    //返回房间
    GameHoodleModle.prototype.on_player_back_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("back_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eBackRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameRoomInterface_1["default"].do_player_back_room(utag);
    };
    //进游戏房间后，服务推送房间内信息
    GameHoodleModle.prototype.on_player_check_link_game = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("check_link_game player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCheckLinkGameRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameProcessInterface_1["default"].do_player_check_link_game(utag);
    };
    //玩家准备
    GameHoodleModle.prototype.on_player_ready = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_user_ready player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        GameProcessInterface_1["default"].do_player_ready(utag);
    };
    //玩家射击
    GameHoodleModle.prototype.on_player_shoot = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_shoot player is not exist!");
            return;
        }
        GameLogicInterface_1["default"].do_player_shoot(utag, proto_type, raw_cmd);
    };
    //玩家位置信息
    GameHoodleModle.prototype.on_player_ball_pos = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_ball_pos player is not exist!");
            return;
        }
        GameLogicInterface_1["default"].do_player_ball_pos(utag, proto_type, raw_cmd);
    };
    //玩家被射中
    GameHoodleModle.prototype.on_player_is_shooted = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_is_shooted player is not exist!");
            return;
        }
        GameLogicInterface_1["default"].do_player_is_shooted(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_match player is not exist!");
            return;
        }
        GameMatchInterface_1["default"].do_player_match(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_stop_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserStopMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_stop_match error player is not exist!");
            return;
        }
        GameMatchInterface_1["default"].do_player_stop_match(utag);
    };
    //游戏服信息,没有去创建，有就返回原来数据
    GameHoodleModle.prototype.on_player_get_ugame_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserGameInfoRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_user_match player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_ugame_info(utag);
    };
    //获取小球信息
    GameHoodleModle.prototype.on_player_get_ball_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserBallInfoRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_get_ball_info error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_ball_info(utag);
    };
    //更新小球信息,合成，卖掉，赠送等
    GameHoodleModle.prototype.on_player_update_ball_info = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUpdateUserBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_update_ball_info error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_update_ball_info(utag, proto_type, raw_cmd);
    };
    //请求商城列表
    GameHoodleModle.prototype.on_player_store_list = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eStoreListRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_store_list error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_store_list(utag);
    };
    GameHoodleModle.prototype.on_player_buy_things = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUpdateUserBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_buy_things error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_buy_things(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_use_hoodleball = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUseHoodleBallRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_use_hoodlebal error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_use_hoodleball(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_get_config = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserConfigRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_config error player is not exist!");
            return;
        }
        GameInfoInterface_1["default"].do_player_get_user_config(utag);
    };
    GameHoodleModle.prototype.on_player_use_emoj = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserEmojRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_use_emoj error player is not exist!");
            return;
        }
        GameEmojInterface_1["default"].do_player_use_emoj(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_play_again_req = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserPlayAgainRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_play_again_req error player is not exist!");
            return;
        }
        GamePlayAgainInterface_1["default"].do_player_play_again_req(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_play_again_answer = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserPlayAgainAnswerRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_player_play_again_answer error player is not exist!");
            return;
        }
        GamePlayAgainInterface_1["default"].do_player_play_again_answer(utag, proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.on_player_room_list_req = function (session, utag, proto_type, raw_cmd) {
        if (!GameCheck_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eRoomListConfigRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
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