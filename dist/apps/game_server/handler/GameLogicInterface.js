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
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var ProtoManager_1 = __importDefault(require("../../../netengine/ProtoManager"));
var GameFunction_1 = __importDefault(require("./GameFunction"));
var RoomListConfig_1 = require("../config/RoomListConfig");
var SendLogicInfo_1 = __importDefault(require("./SendLogicInfo"));
var State_1 = __importDefault(require("../../config/State"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GameLogicInterface = /** @class */ (function () {
    function GameLogicInterface() {
    }
    GameLogicInterface.do_player_shoot = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, userstate, room, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!player) {
                            Log_1["default"].warn("on_player_shoot player is not exist!");
                            return [2 /*return*/];
                        }
                        userstate = player.get_user_state();
                        if (userstate != State_1["default"].UserState.Playing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_shoot user is not in playing state!");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (room) {
                            if (room.get_game_state() != State_1["default"].GameState.Gameing) {
                                Log_1["default"].warn(player.get_unick(), "on_player_shoot room is not in playing state!");
                                return [2 /*return*/];
                            }
                            body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                            SendLogicInfo_1["default"].send_player_shoot(room, body, player.get_uid());
                            //设置下一个玩家射击权限
                            GameFunction_1["default"].set_next_player_power(room);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameLogicInterface.do_player_ball_pos = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, userstate, room, player_set, body, key, posinfo, seatid, posx, posy, k, p, pos_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!player) {
                            Log_1["default"].warn("on_player_shoot player is not exist!");
                            return [2 /*return*/];
                        }
                        userstate = player.get_user_state();
                        if (userstate != State_1["default"].UserState.Playing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_ball_pos user is not in playing state!");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (room) {
                            if (room.get_game_state() != State_1["default"].GameState.Gameing) {
                                Log_1["default"].warn(player.get_unick(), "on_player_ball_pos room is not in playing state!");
                                return [2 /*return*/];
                            }
                            player_set = room.get_all_player();
                            body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                            // Log.info("hcc>>on_player_ball_pos ", body);
                            for (key in body.positions) {
                                posinfo = body.positions[key];
                                seatid = posinfo.seatid;
                                posx = posinfo.posx;
                                posy = posinfo.posy;
                                for (k in player_set) {
                                    p = player_set[k];
                                    if (p && p.get_seat_id() == seatid) {
                                        pos_info = { posx: posx, posy: posy };
                                        p.set_user_pos(pos_info);
                                        break;
                                    }
                                }
                            }
                            //重新发送玩家位置信息
                            SendLogicInfo_1["default"].send_player_ball_pos(room);
                            //小球停下来后，才发送权限
                            SendLogicInfo_1["default"].send_player_power(room);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameLogicInterface.do_player_is_shooted = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, userstate, room, body, baseScore, levelConfig, src_player, des_player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!player) {
                            return [2 /*return*/];
                        }
                        userstate = player.get_user_state();
                        if (userstate != State_1["default"].UserState.Playing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_is_shooted user is not in playing state!");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (!room) return [3 /*break*/, 3];
                        if (room.get_game_state() != State_1["default"].GameState.Gameing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_is_shooted room is not in playing state!");
                            return [2 /*return*/];
                        }
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        SendLogicInfo_1["default"].send_player_is_shooted(room, body);
                        baseScore = 1;
                        if (room.get_is_match_room()) {
                            levelConfig = RoomListConfig_1.RoomListConfig[room.get_match_roomlevel()];
                            if (levelConfig) {
                                baseScore = Number(levelConfig.baseScore);
                            }
                        }
                        src_player = room.get_player_by_seatid(body.srcseatid);
                        des_player = room.get_player_by_seatid(body.desseatid);
                        if (src_player && des_player) {
                            src_player.set_user_score(src_player.get_user_score() + baseScore);
                            des_player.set_user_score(des_player.get_user_score() - baseScore);
                            // Log.info("hcc>>playerScore: src_player:", src_player.get_unick(), "+1", " des_player:", des_player.get_unick(), "-1");
                        }
                        //发送分数
                        SendLogicInfo_1["default"].send_player_score(room);
                        //设置游戏状态为结算状态
                        room.set_game_state(State_1["default"].GameState.CheckOut);
                        //发送玩家状态
                        GameFunction_1["default"].set_all_player_state(room, State_1["default"].UserState.InView);
                        SendLogicInfo_1["default"].broadcast_player_info_in_rooom(room);
                        //清除上一局数据
                        GameFunction_1["default"].clear_all_player_cur_data(room);
                        //发送权限
                        SendLogicInfo_1["default"].send_player_power(room);
                        //发送结算
                        SendLogicInfo_1["default"].send_game_result(room);
                        if (!(room.get_cur_play_count() == room.get_max_play_count())) return [3 /*break*/, 3];
                        return [4 /*yield*/, GameFunction_1["default"].cal_player_chip_and_write(room)];
                    case 2:
                        _a.sent(); //计算金币,需要加await，不然会先执行下面的
                        SendLogicInfo_1["default"].send_game_total_result(room);
                        roomMgr.delete_room(room.get_room_id());
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return GameLogicInterface;
}());
exports["default"] = GameLogicInterface;
//# sourceMappingURL=GameLogicInterface.js.map