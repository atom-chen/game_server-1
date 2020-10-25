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
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var SendBaseInfo = /** @class */ (function () {
    function SendBaseInfo() {
    }
    ////////////////////////////////////////
    ///发送基本信息
    ////////////////////////////////////////
    //向房间内所有人发送局内玩家信息
    SendBaseInfo.broadcast_player_info_in_rooom = function (room, not_uid) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var userinfo_array = [];
        try {
            for (var key in player_set) {
                var player = player_set[key];
                if (player) {
                    var userinfo = {
                        numberid: String(player.get_numberid()),
                        userinfostring: JSON.stringify(player.get_player_info())
                    };
                    userinfo_array.push(userinfo);
                }
            }
            room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.eUserInfoRes, { userinfo: userinfo_array }, not_uid);
        }
        catch (error) {
            Log_1["default"].error(error);
        }
    };
    //向某个玩家发送局内玩家信息
    SendBaseInfo.send_player_info = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var room, player_set, userinfo_array, key, player_1, userinfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!player) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (!room) {
                            return [2 /*return*/];
                        }
                        player_set = room.get_all_player();
                        if (ArrayUtil_1["default"].GetArrayLen(player_set) <= 0) {
                            return [2 /*return*/];
                        }
                        userinfo_array = [];
                        try {
                            for (key in player_set) {
                                player_1 = player_set[key];
                                if (player_1) {
                                    userinfo = {
                                        numberid: String(player_1.get_numberid()),
                                        userinfostring: JSON.stringify(player_1.get_player_info())
                                    };
                                    userinfo_array.push(userinfo);
                                }
                            }
                            player.send_cmd(GameHoodleProto_1["default"].XY_ID.eUserInfoRes, { userinfo: userinfo_array });
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //向房间内所有人发送某玩家准备的消息
    SendBaseInfo.send_player_state = function (room, src_player, not_to_player) {
        var body = {
            status: Response_1["default"].SUCCESS,
            seatid: Number(src_player.get_seat_id()),
            userstate: Number(src_player.get_user_state())
        };
        var not_uid = not_to_player ? not_to_player.get_uid() : undefined;
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.eUserReadyRes, body, not_uid);
    };
    //发送局数
    SendBaseInfo.send_play_count = function (room, not_to_player) {
        var body = {
            playcount: String(room.get_cur_play_count()),
            totalplaycount: String(room.get_max_play_count())
        };
        var not_uid = not_to_player ? not_to_player.get_uid() : undefined;
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayCountRes, body, not_uid);
    };
    //发送小结算
    SendBaseInfo.send_game_result = function (room) {
    };
    //发送大结算
    SendBaseInfo.send_game_total_result = function (room) {
    };
    return SendBaseInfo;
}());
exports["default"] = SendBaseInfo;
//# sourceMappingURL=SendBaseInfo.js.map