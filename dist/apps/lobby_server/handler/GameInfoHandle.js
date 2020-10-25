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
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var RedisGame_1 = __importDefault(require("../../../database/RedisGame"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameHoodleConfig_1 = __importDefault(require("../../game_server/config/GameHoodleConfig"));
var LobbySendMsg_1 = __importDefault(require("../LobbySendMsg"));
var LobbyProto_1 = __importDefault(require("../../protocol/protofile/LobbyProto"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var GameInfoHandle = /** @class */ (function () {
    function GameInfoHandle() {
    }
    //查询玩家信息
    GameInfoHandle.do_get_ugame_info = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisGame_1["default"].get_gameinfo_inredis(utag)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    GameInfoHandle.do_req_login_lobby = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle.do_check_ugame_info(utag)];
                    case 1:
                        ret = _a.sent();
                        if (ret) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_LOBINLOBBY, utag, proto_type, { status: Response_1["default"].SUCCESS });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameInfoHandle.do_req_game_info = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info_obj, userinfostring, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisGame_1["default"].get_gameinfo_inredis(utag)];
                    case 1:
                        game_info_obj = _a.sent();
                        // Log.info("hcc>>do_req_game_info>>", game_info_obj);
                        try {
                            if (game_info_obj) {
                                userinfostring = JSON.stringify(game_info_obj);
                                body = {
                                    status: Response_1["default"].SUCCESS,
                                    userinfostring: userinfostring
                                };
                                LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_GAMEINFO, utag, proto_type, body);
                                return [2 /*return*/];
                            }
                        }
                        catch (error) {
                            Log_1["default"].error("hcc>>do_req_game_info>>", error);
                        }
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_GAMEINFO, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                        return [2 /*return*/];
                }
            });
        });
    };
    //查询玩家游戏服务信息，不存在就创建
    GameInfoHandle.do_check_ugame_info = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            var data_game, data_game_len, game_info, ret, ret_insert, data_game2, data_game_len2, game_info2, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_info_by_uid(utag)];
                    case 1:
                        data_game = _a.sent();
                        if (!data_game) return [3 /*break*/, 7];
                        data_game_len = ArrayUtil_1["default"].GetArrayLen(data_game);
                        if (!(data_game_len > 0)) return [3 /*break*/, 3];
                        game_info = data_game[0];
                        return [4 /*yield*/, RedisGame_1["default"].set_gameinfo_inredis(utag, game_info)];
                    case 2:
                        ret = _a.sent();
                        // Log.info("hcc>>on_user_get_ugame_info1111>>", game_info);
                        Log_1["default"].info("hcc>>ret:", ret);
                        return [2 /*return*/, true];
                    case 3: return [4 /*yield*/, MySqlGame_1["default"].insert_ugame_user(utag, GameHoodleConfig_1["default"].KW_BORN_EXP, GameHoodleConfig_1["default"].KW_BORN_CHIP)];
                    case 4:
                        ret_insert = _a.sent();
                        if (!ret_insert) return [3 /*break*/, 7];
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_info_by_uid(utag)];
                    case 5:
                        data_game2 = _a.sent();
                        if (!data_game2) return [3 /*break*/, 7];
                        data_game_len2 = ArrayUtil_1["default"].GetArrayLen(data_game2);
                        if (!(data_game_len2 > 0)) return [3 /*break*/, 7];
                        game_info2 = data_game2[0];
                        return [4 /*yield*/, RedisGame_1["default"].set_gameinfo_inredis(utag, game_info2)];
                    case 6:
                        ret = _a.sent();
                        // Log.info("hcc>>on_user_get_ugame_info1222>>", game_info2);
                        Log_1["default"].info("hcc>>ret:", ret);
                        return [2 /*return*/, true];
                    case 7: return [2 /*return*/, false];
                }
            });
        });
    };
    return GameInfoHandle;
}());
exports["default"] = GameInfoHandle;
//# sourceMappingURL=GameInfoHandle.js.map