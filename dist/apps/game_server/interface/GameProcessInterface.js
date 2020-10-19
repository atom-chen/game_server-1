"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../../utils/Log"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var State_1 = require("../config/State");
var GameFunction_1 = __importDefault(require("./GameFunction"));
var GameCheck_1 = __importDefault(require("./GameCheck"));
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var GameSendMsg_1 = __importDefault(require("../GameSendMsg"));
var playerMgr = PlayerManager_1["default"].getInstance();
var GameProcessInterface = /** @class */ (function () {
    function GameProcessInterface() {
    }
    //玩家进入房间收到，服务主动推送相关局内数据
    GameProcessInterface.do_player_check_link_game = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, room, player_set, idx, p;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!GameCheck_1["default"].check_player(utag)) {
                            Log_1["default"].warn("check_link_game player is not exist!");
                            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eCheckLinkGameRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                            return [2 /*return*/];
                        }
                        player = playerMgr.get_player(utag);
                        if (!player) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (!room) {
                            return [2 /*return*/];
                        }
                        player.send_cmd(GameHoodleProto_1["default"].XY_ID.eCheckLinkGameRes, { status: Response_1["default"].OK });
                        player.send_cmd(GameHoodleProto_1["default"].XY_ID.eRoomIdRes, { roomid: room.get_room_id() });
                        player.send_cmd(GameHoodleProto_1["default"].XY_ID.eGameRuleRes, { gamerule: room.get_game_rule() });
                        player.send_cmd(GameHoodleProto_1["default"].XY_ID.ePlayCountRes, { playcount: String(room.get_cur_play_count()), totalplaycount: String(room.get_max_play_count()) });
                        GameFunction_1["default"].send_player_info(player);
                        //处理断线重连,只发送给重连玩家
                        //玩家位置，局数，玩家权限，玩家得分
                        if (room.get_game_state() == State_1.GameState.Gameing) {
                            player.send_cmd(GameHoodleProto_1["default"].XY_ID.eGameStartRes, { status: Response_1["default"].OK });
                            GameFunction_1["default"].send_player_ball_pos(room, undefined, player);
                            GameFunction_1["default"].send_player_power(room, undefined, player);
                            GameFunction_1["default"].send_player_score(room, undefined, player);
                        }
                        //如果有机器人，要发权限给机器人,防止机器人射击之后，别的玩家退出，再进来，卡了
                        if (room.get_game_state() == State_1.GameState.Gameing) {
                            player_set = room.get_all_player();
                            for (idx in player_set) {
                                p = player_set[idx];
                                if (p.is_robot()) {
                                    GameFunction_1["default"].send_player_power(room, undefined, p);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //玩家准备
    GameProcessInterface.do_player_ready = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, userstate, room, is_game_start;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!GameCheck_1["default"].check_player(utag)) {
                            Log_1["default"].warn("on_user_ready player is not exist!");
                            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                            return [2 /*return*/];
                        }
                        player = playerMgr.get_player(utag);
                        userstate = player.get_user_state();
                        if (userstate == State_1.UserState.Ready || userstate == State_1.UserState.Playing) {
                            Log_1["default"].warn(player.get_unick(), "on_user_ready user is already ready or is playing!");
                            player.send_cmd(GameHoodleProto_1["default"].XY_ID.eUserReadyRes, { status: Response_1["default"].INVALIDI_OPT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (room) {
                            //已经在游戏中了
                            if (room.get_game_state() == State_1.GameState.Gameing) {
                                player.send_cmd(GameHoodleProto_1["default"].XY_ID.eUserReadyRes, { status: Response_1["default"].INVALIDI_OPT });
                                Log_1["default"].warn("on_user_ready error ,game is playing!");
                                return [2 /*return*/];
                            }
                            //已经大结算了
                            if (room.get_cur_play_count() == room.get_max_play_count()) {
                                player.send_cmd(GameHoodleProto_1["default"].XY_ID.eUserReadyRes, { status: Response_1["default"].INVALIDI_OPT });
                                Log_1["default"].warn("on_user_ready error ,game is over!");
                                return [2 /*return*/];
                            }
                            //有玩家准备了，发送状态
                            player.set_user_state(State_1.UserState.Ready);
                            GameFunction_1["default"].send_player_state(room, player);
                            is_game_start = GameCheck_1["default"].check_game_start(room);
                            if (is_game_start) {
                                GameFunction_1["default"].set_all_player_state(room, State_1.UserState.Playing);
                                GameFunction_1["default"].broadcast_player_info_in_rooom(room); //刷新局内玩家信息：Playing
                                //设置游戏状态为游戏中
                                room.set_game_state(State_1.GameState.Gameing);
                                //发送游戏开始
                                room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.eGameStartRes, { status: Response_1["default"].OK });
                                //游戏逻辑发送
                                GameFunction_1["default"].send_player_first_pos(room);
                                //设置初始权限
                                GameFunction_1["default"].set_player_start_power(room);
                                //玩家权限发送
                                GameFunction_1["default"].send_player_power(room);
                                //发送分数
                                GameFunction_1["default"].send_player_score(room);
                                //局数自加
                                room.set_cur_play_count(room.get_cur_play_count() + 1);
                                //发送局数
                                GameFunction_1["default"].send_play_count(room);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameProcessInterface;
}());
exports["default"] = GameProcessInterface;
//# sourceMappingURL=GameProcessInterface.js.map