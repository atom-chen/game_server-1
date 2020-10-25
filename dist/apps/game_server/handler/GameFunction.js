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
var StringUtil_1 = __importDefault(require("../../../utils/StringUtil"));
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var State_1 = __importDefault(require("../../config/State"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var RedisGame_1 = __importDefault(require("../../../database/RedisGame"));
var GameFunction = /** @class */ (function () {
    function GameFunction() {
    }
    //检测游戏开始
    GameFunction.check_game_start = function (room) {
        var player_set = room.get_all_player();
        var ready_player_count = 0;
        for (var uid in player_set) {
            var player = player_set[uid];
            if (player) {
                if (player.get_user_state() == State_1["default"].UserState.Ready) {
                    ready_player_count++;
                }
            }
        }
        Log_1["default"].info("check_game_start: readycount: ", ready_player_count);
        if (ready_player_count == room.get_max_player_count()) {
            return true;
        }
        return false;
    };
    //设置房间内所有玩家状态
    GameFunction.set_all_player_state = function (room, user_state) {
        var player_set = room.get_all_player();
        for (var uid in player_set) {
            var player = player_set[uid];
            if (player) {
                player.set_user_state(user_state);
            }
        }
    };
    //生成初始坐标(为了不让小球开局位置在一块)
    GameFunction.generate_start_pos = function (pos_index) {
        // let posx = StringUtil.random_int(-540 , 540);
        // let posy = StringUtil.random_int(-960 , 960);
        var posx_random = 0;
        var posy_random = 0;
        if (pos_index % 2 == 0) {
            var array_len = GameFunction._startx_left_array.length;
            posx_random = GameFunction._startx_left_array[StringUtil_1["default"].random_int(0, array_len - 1)];
            array_len = GameFunction._starty_up_array.length;
            posy_random = GameFunction._starty_up_array[StringUtil_1["default"].random_int(0, array_len - 1)];
        }
        else {
            var array_len = GameFunction._startx_right_array.length;
            posx_random = GameFunction._startx_right_array[StringUtil_1["default"].random_int(0, array_len - 1)];
            array_len = GameFunction._starty_down_array.length;
            posy_random = GameFunction._starty_down_array[StringUtil_1["default"].random_int(0, array_len - 1)];
        }
        var startx_pos = posx_random < 0 ? posx_random : 0;
        var endx_pos = posx_random > 0 ? posx_random : 0;
        var starty_pos = posy_random < 0 ? posy_random : 0;
        var endy_pos = posy_random > 0 ? posy_random : 0;
        var posx = StringUtil_1["default"].random_int(startx_pos, endx_pos);
        var posy = StringUtil_1["default"].random_int(starty_pos, endy_pos);
        return { posx: posx, posy: posy };
    };
    //清除玩家当局数据
    GameFunction.clear_all_player_cur_data = function (room) {
        var player_set = room.get_all_player();
        for (var uid in player_set) {
            var player = player_set[uid];
            if (player) {
                player.set_user_power(State_1["default"].PlayerPower.canNotPlay);
                player.set_user_pos({ posx: 0, posy: 0 });
            }
        }
    };
    //设置玩家初始权限
    GameFunction.set_player_start_power = function (room) {
        var can_play_seatid = StringUtil_1["default"].random_int(1, room.get_max_player_count());
        var player_set = room.get_all_player();
        var player_array = [];
        for (var key in player_set) {
            player_array.push(player_set[key]);
        }
        var player = player_array[can_play_seatid - 1];
        if (!player) {
            Log_1["default"].error("hcc>>set_player_start_power player is null ,seatid: ", can_play_seatid);
            return false;
        }
        player.set_user_power(State_1["default"].PlayerPower.canPlay);
        // Log.info("hcc>>set_player_start_power seatid: " + player.get_seat_id() , " ,power: " + player.get_user_power());
        return true;
    };
    //计算玩家权限
    GameFunction.set_next_player_power = function (room) {
        var player_set = room.get_all_player();
        var next_power_seatid = -1;
        for (var uid in player_set) {
            var player = player_set[uid];
            if (player) {
                var power = player.get_user_power();
                if (power == State_1["default"].PlayerPower.canPlay) {
                    player.set_user_power(State_1["default"].PlayerPower.canNotPlay);
                    next_power_seatid = player.get_seat_id() + 1;
                    if (next_power_seatid > room.get_max_player_count()) {
                        next_power_seatid = next_power_seatid % room.get_max_player_count();
                    }
                    //  Log.info("hcc>> cur power seat: " , player.get_seat_id());
                    //  Log.info("hcc>> next power seat: " , next_power_seatid);
                    break;
                }
            }
        }
        if (next_power_seatid == -1) {
            Log_1["default"].error("error: next_power_seatid is -1");
            return;
        }
        for (var uid in player_set) {
            var player = player_set[uid];
            if (player) {
                if (player.get_seat_id() == next_power_seatid) {
                    player.set_user_power(State_1["default"].PlayerPower.canPlay);
                }
                else {
                    player.set_user_power(State_1["default"].PlayerPower.canNotPlay);
                }
            }
        }
    };
    //计算玩家金币，设置到player，写入数据库
    //考虑不够减的情况(扣除只够扣的金币)
    GameFunction.cal_player_chip_and_write = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var player_set, _a, _b, _i, key, player, score, gold_win, player_cur_chip, ret, data_game, data_game_len;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!room) {
                            return [2 /*return*/];
                        }
                        player_set = room.get_all_player();
                        _a = [];
                        for (_b in player_set)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        key = _a[_i];
                        player = player_set[key];
                        if (!player) return [3 /*break*/, 4];
                        score = player.get_user_score();
                        gold_win = score * GameHoodleConfig_1["default"].KW_WIN_RATE;
                        if (!(gold_win != 0)) return [3 /*break*/, 4];
                        player_cur_chip = player.get_uchip();
                        if (gold_win < 0) {
                            if (Math.abs(gold_win) > Math.abs(player_cur_chip)) {
                                gold_win = (-1) * player_cur_chip;
                            }
                        }
                        return [4 /*yield*/, MySqlGame_1["default"].add_ugame_uchip(player.get_uid(), gold_win)];
                    case 2:
                        ret = _c.sent();
                        if (!ret) return [3 /*break*/, 4];
                        Log_1["default"].info("hcc>> name: ", player.get_unick(), "add ", gold_win, " coin success!!");
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_info_by_uid(player.get_uid())];
                    case 3:
                        data_game = _c.sent();
                        if (data_game) {
                            data_game_len = ArrayUtil_1["default"].GetArrayLen(data_game);
                            if (data_game_len > 0) {
                                RedisGame_1["default"].set_gameinfo_inredis(player.get_uid(), data_game[0]);
                            }
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GameFunction._startx_left_array = [-480, -400, -300, -200, -100];
    GameFunction._startx_right_array = [480, 400, 300, 200, 100];
    GameFunction._starty_up_array = [900, 700, 500, 300, 100];
    GameFunction._starty_down_array = [-900, -700, -500, -300, -100];
    return GameFunction;
}());
exports["default"] = GameFunction;
//# sourceMappingURL=GameFunction.js.map