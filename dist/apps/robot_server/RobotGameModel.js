"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var Response_1 = __importDefault(require("../protocol/Response"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = require("../protocol/Stype");
var GameHoodleProto_1 = require("../protocol/protofile/GameHoodleProto");
var RobotSend_1 = __importDefault(require("./RobotSend"));
var RobotMgr_1 = __importDefault(require("./manager/RobotMgr"));
var util = __importStar(require("util"));
var State_1 = require("../game_server/config/State");
var RobotListConfig_1 = __importDefault(require("./config/RobotListConfig"));
var RobotGameInterface_1 = __importDefault(require("./interface/RobotGameInterface"));
/**
 * 当前作为客户端，utag用来标记哪一位玩家
 * send_game，是当前作为客户端发给game服务。
 */
var RobotGameModel = /** @class */ (function () {
    function RobotGameModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[GameHoodleProto_1.Cmd.eLoginLogicRes] = this.on_player_login_logic_res,
            _a[GameHoodleProto_1.Cmd.eGetRoomStatusRes] = this.on_player_status_res,
            _a[GameHoodleProto_1.Cmd.eUserMatchRes] = this.on_event_match_res,
            _a[GameHoodleProto_1.Cmd.eUserInfoRes] = this.on_event_user_info_res,
            _a[GameHoodleProto_1.Cmd.eGameStartRes] = this.on_event_game_start_res,
            _a[GameHoodleProto_1.Cmd.ePlayerPowerRes] = this.on_event_power_res,
            _a[GameHoodleProto_1.Cmd.eGameResultRes] = this.on_event_game_result_res,
            _a[GameHoodleProto_1.Cmd.eTotalGameResultRes] = this.on_event_game_total_result_res,
            _a[GameHoodleProto_1.Cmd.eUserEmojRes] = this.on_event_emoj_res,
            _a[GameHoodleProto_1.Cmd.ePlayerShootRes] = this.on_event_player_shoot_res,
            _a[GameHoodleProto_1.Cmd.ePlayerBallPosRes] = this.on_event_ball_pos_res,
            _a[GameHoodleProto_1.Cmd.eDessolveRes] = this.on_event_desolve_res,
            _a[GameHoodleProto_1.Cmd.eBackRoomRes] = this.on_event_back_room_res,
            _a);
    }
    RobotGameModel.getInstance = function () {
        return RobotGameModel.Instance;
    };
    RobotGameModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1.StypeName[stype], " ,cmdName: ", GameHoodleProto_1.CmdName[ctype], " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    // send match to game server
    RobotGameModel.prototype.on_player_login_logic_res = function (session, utag, proto_type, raw_cmd) {
        Log_1["default"].info("hcc>>on_player_login_logic_res.....,utag: ", utag);
        RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eUserGameInfoReq, utag);
        RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eRoomListConfigReq, utag);
        RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eGetRoomStatusReq, utag);
    };
    RobotGameModel.prototype.on_player_status_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body && res_body.status == Response_1["default"].OK) { //at room
            RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eBackRoomReq, utag);
        }
        else { //not at room, free
            RobotGameInterface_1["default"].go_to_match_game(session, utag);
        }
    };
    //as soon as match success, send ready to game server
    RobotGameModel.prototype.on_event_match_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body && res_body.status == Response_1["default"].OK) {
            if (res_body.matchsuccess) {
                setTimeout(function () {
                    RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eUserReadyReq, utag);
                }, RobotListConfig_1["default"].READY_DELAY_TIME);
            }
        }
    };
    RobotGameModel.prototype.on_event_user_info_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            var userinfo = res_body.userinfo;
            if (userinfo) {
                for (var key in userinfo) {
                    var info = userinfo[key];
                    var numberid = info.numberid;
                    var userinfostring = info.userinfostring;
                    if (userinfostring) {
                        var userinfoObj = JSON.parse(userinfostring);
                        if (userinfoObj) {
                            var info_uid = userinfoObj.uid;
                            if (info_uid == utag) {
                                RobotMgr_1["default"].getInstance().add_robot_by_uinfo(userinfoObj); //不会重复添加
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    RobotGameModel.prototype.on_event_game_start_res = function (session, utag, proto_type, raw_cmd) {
    };
    RobotGameModel.prototype.on_event_power_res = function (session, utag, proto_type, raw_cmd) {
        var RobotMgrIns = RobotMgr_1["default"].getInstance();
        var robot = RobotMgrIns.get_robot(utag);
        if (robot) {
            var robot_seatid = robot.get_seatid();
            if (!util.isNullOrUndefined(robot_seatid)) {
                var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                if (res_body && res_body.powers) {
                    var _loop_1 = function (key) {
                        var res_seatid = res_body.powers[key].seatid;
                        var res_power = res_body.powers[key].power;
                        if (robot_seatid == res_seatid && res_power == State_1.PlayerPower.canPlay) {
                            var other_pos = RobotMgrIns.get_other_pos(utag);
                            var req_body_1 = {
                                seatid: robot_seatid,
                                posx: String(100),
                                posy: String(200),
                                shootpower: Number(1000)
                            };
                            if (!util.isNullOrUndefined(other_pos)) { //往敌人方向射击
                                req_body_1 = {
                                    seatid: robot_seatid,
                                    posx: String(other_pos.posx),
                                    posy: String(other_pos.posy),
                                    shootpower: Number(1000)
                                };
                            }
                            setTimeout(function () {
                                RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.ePlayerShootReq, utag, req_body_1);
                            }, RobotListConfig_1["default"].SHOOT_DELAY_TIME);
                            return "break";
                        }
                    };
                    for (var key in res_body.powers) {
                        var state_1 = _loop_1(key);
                        if (state_1 === "break")
                            break;
                    }
                }
            }
        }
    };
    RobotGameModel.prototype.on_event_game_result_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            var isfinal = res_body.isfinal;
            if (util.isNullOrUndefined(isfinal) || isfinal == false) {
                RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eUserReadyReq, utag);
            }
        }
        RobotGameInterface_1["default"].send_emoj_random_timeout(session, utag, 1000);
    };
    RobotGameModel.prototype.on_event_game_total_result_res = function (session, utag, proto_type, raw_cmd) {
        RobotGameInterface_1["default"].go_to_match_game(session, utag);
    };
    RobotGameModel.prototype.on_event_emoj_res = function (session, utag, proto_type, raw_cmd) {
    };
    RobotGameModel.prototype.on_event_player_shoot_res = function (session, utag, proto_type, raw_cmd) {
    };
    RobotGameModel.prototype.on_event_ball_pos_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            var positions = res_body.positions;
            if (positions) {
                RobotMgr_1["default"].getInstance().set_positions(utag, positions);
                Log_1["default"].info("on_event_ball_pos_res: ", utag);
            }
        }
        RobotGameInterface_1["default"].send_emoj_random_timeout(session, utag, 1000);
    };
    RobotGameModel.prototype.on_event_desolve_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            if (res_body.status == Response_1["default"].OK) {
                RobotGameInterface_1["default"].go_to_match_game(session, utag);
            }
        }
    };
    RobotGameModel.prototype.on_event_back_room_res = function (session, utag, proto_type, raw_cmd) {
        var res_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (res_body && res_body.status == Response_1["default"].OK) {
            RobotSend_1["default"].send_game(session, GameHoodleProto_1.Cmd.eCheckLinkGameReq, utag);
        }
    };
    RobotGameModel.Instance = new RobotGameModel();
    return RobotGameModel;
}());
exports["default"] = RobotGameModel;
//# sourceMappingURL=RobotGameModel.js.map