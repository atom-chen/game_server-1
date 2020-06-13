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
var Log_1 = __importDefault(require("../../../../utils/Log"));
var PlayerManager_1 = __importDefault(require("../PlayerManager"));
var RoomManager_1 = __importDefault(require("../RoomManager"));
var State_1 = require("../config/State");
var ProtoManager_1 = __importDefault(require("../../../../netbus/ProtoManager"));
var GameFunction_1 = __importDefault(require("./GameFunction"));
var GameCheck_1 = __importDefault(require("./GameCheck"));
var RoomListConfig_1 = require("../config/RoomListConfig");
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GameLogicInterface = /** @class */ (function () {
    function GameLogicInterface() {
    }
    GameLogicInterface.do_player_shoot = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        if (!GameCheck_1["default"].check_room(utag)) {
            Log_1["default"].warn(player.get_unick(), "on_player_shoot room is not exist!");
            return;
        }
        var userstate = player.get_user_state();
        if (userstate != State_1.UserState.Playing) {
            Log_1["default"].warn(player.get_unick(), "on_player_shoot user is not in playing state!");
            return;
        }
        var room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != State_1.GameState.Gameing) {
                Log_1["default"].warn(player.get_unick(), "on_player_shoot room is not in playing state!");
                return;
            }
            //发送玩家射击信息
            var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
            GameFunction_1["default"].send_player_shoot(room, body, player);
            //设置下一个玩家射击权限
            GameFunction_1["default"].set_next_player_power(room);
            //发送权限
            // GameFunction.send_player_power(room); //在玩家停下来的时候发送权限，不在这里发
        }
    };
    GameLogicInterface.do_player_ball_pos = function (utag, proto_type, raw_cmd) {
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        if (!GameCheck_1["default"].check_room(utag)) {
            Log_1["default"].warn(player.get_unick(), "on_player_ball_pos room is not exist!");
            return;
        }
        var userstate = player.get_user_state();
        if (userstate != State_1.UserState.Playing) {
            Log_1["default"].warn(player.get_unick(), "on_player_ball_pos user is not in playing state!");
            return;
        }
        var room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != State_1.GameState.Gameing) {
                Log_1["default"].warn(player.get_unick(), "on_player_ball_pos room is not in playing state!");
                return;
            }
            var player_set = room.get_all_player();
            //保存玩家位置信息
            var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
            // Log.info("hcc>>on_player_ball_pos ", body);
            for (var key in body.positions) {
                var posinfo = body.positions[key];
                var seatid = posinfo.seatid;
                var posx = posinfo.posx;
                var posy = posinfo.posy;
                for (var k in player_set) {
                    var p = player_set[k];
                    if (p && p.get_seat_id() == seatid) {
                        var pos_info = { posx: posx, posy: posy };
                        p.set_user_pos(pos_info);
                        break;
                    }
                }
            }
            //重新发送玩家位置信息
            GameFunction_1["default"].send_player_ball_pos(room);
            //小球停下来后，才发送权限
            GameFunction_1["default"].send_player_power(room);
        }
    };
    GameLogicInterface.do_player_is_shooted = function (utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, userstate, room, body, baseScore, levelConfig, src_player, des_player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!GameCheck_1["default"].check_room(utag)) {
                            Log_1["default"].warn(player.get_unick(), "on_player_is_shooted room is not exist!");
                            return [2 /*return*/];
                        }
                        userstate = player.get_user_state();
                        if (userstate != State_1.UserState.Playing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_is_shooted user is not in playing state!");
                            return [2 /*return*/];
                        }
                        room = roomMgr.get_room_by_uid(player.get_uid());
                        if (!room) return [3 /*break*/, 2];
                        if (room.get_game_state() != State_1.GameState.Gameing) {
                            Log_1["default"].warn(player.get_unick(), "on_player_is_shooted room is not in playing state!");
                            return [2 /*return*/];
                        }
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        GameFunction_1["default"].send_player_is_shooted(room, body);
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
                            Log_1["default"].info("hcc>>playerScore: src_player:", src_player.get_unick(), "+1", " des_player:", des_player.get_unick(), "-1");
                        }
                        //发送分数
                        GameFunction_1["default"].send_player_score(room);
                        //设置游戏状态为结算状态
                        room.set_game_state(State_1.GameState.CheckOut);
                        //发送玩家状态
                        GameFunction_1["default"].set_all_player_state(room, State_1.UserState.InView);
                        GameFunction_1["default"].broadcast_player_info_in_rooom(room);
                        //清除上一局数据
                        GameFunction_1["default"].clear_all_player_cur_data(room);
                        //发送权限
                        GameFunction_1["default"].send_player_power(room);
                        //发送结算
                        GameFunction_1["default"].send_game_result(room);
                        if (!(room.get_play_count() == room.get_conf_play_count())) return [3 /*break*/, 2];
                        return [4 /*yield*/, GameFunction_1["default"].cal_player_chip_and_write(room)];
                    case 1:
                        _a.sent(); //计算金币
                        GameFunction_1["default"].send_game_total_result(room);
                        room.kick_all_player();
                        roomMgr.delete_room(room.get_room_id());
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return GameLogicInterface;
}());
exports["default"] = GameLogicInterface;
//# sourceMappingURL=GameLogicInterface.js.map