"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var NetServer_1 = __importDefault(require("../../../netengine/NetServer"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var Stype_1 = __importDefault(require("../../protocol/Stype"));
var PlayerBase_1 = __importDefault(require("./PlayerBase"));
var RedisLobby_1 = __importDefault(require("../../../database/RedisLobby"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var querystring_1 = __importDefault(require("querystring"));
var State_1 = __importDefault(require("../../config/State"));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(session, uid, proto_type) {
        var _this = _super.call(this, session, uid, proto_type) || this;
        //居内数据
        _this._user_state = State_1["default"].UserState.InView; //玩家状态
        _this._user_pos = { posx: 0, posy: 0 }; //玩家位置 
        _this._user_power = 0; //玩家权限
        _this._user_score = 0; //玩家得分
        _this._user_ball_info = ""; //json串，玩家小球信息
        //玩家配置（身上的装备，弹珠等级，等等）
        _this._user_config = {};
        return _this;
    }
    Player.prototype.init_data = function (session, uid, proto_type) {
        return __awaiter(this, void 0, void 0, function () {
            var config, room_info_obj, uids, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init_data.call(this, session, uid, proto_type)];
                    case 1:
                        _a.sent();
                        try {
                            config = this._game_info.user_config || "";
                            this._user_config = querystring_1["default"].decode(config);
                            this._user_ball_info = this._game_info.uball_info;
                        }
                        catch (error) {
                            Log_1["default"].error("hcc>>init_data", error);
                        }
                        return [4 /*yield*/, this.get_room_info()];
                    case 2:
                        room_info_obj = _a.sent();
                        if (room_info_obj) {
                            uids = room_info_obj.uids || [];
                            for (index = 0; index < uids.length; index++) {
                                if (uids[index] == this._uid) {
                                    this._seat_id = index + 1;
                                    break;
                                }
                            }
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /////////////////////////////////
    //获取此玩家所在房间信息
    Player.prototype.get_room_info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var room_info_str, room_info_obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_uid(this._uid)];
                    case 1:
                        room_info_str = _a.sent();
                        room_info_obj = {};
                        try {
                            room_info_obj = JSON.parse(room_info_str);
                        }
                        catch (error) {
                            Log_1["default"].error("get_room_info error>>", error);
                        }
                        return [2 /*return*/, room_info_obj];
                }
            });
        });
    };
    //获取次玩家所在房间id
    Player.prototype.get_roomid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var room_info_obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_room_info()];
                    case 1:
                        room_info_obj = _a.sent();
                        if (room_info_obj) {
                            return [2 /*return*/, room_info_obj.roomid];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //获取此玩家所在房间对象
    Player.prototype.get_room = function () {
        return __awaiter(this, void 0, void 0, function () {
            var roomid, room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_roomid()];
                    case 1:
                        roomid = _a.sent();
                        room = RoomManager_1["default"].getInstance().get_room_by_roomid(roomid);
                        return [2 /*return*/, room];
                }
            });
        });
    };
    //获取房间内所有玩家UID
    Player.prototype.get_all_uids = function () {
        return __awaiter(this, void 0, void 0, function () {
            var room_info_obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_room_info()];
                    case 1:
                        room_info_obj = _a.sent();
                        if (room_info_obj) {
                            return [2 /*return*/, room_info_obj.uids];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //发送给房间所有人
    Player.prototype.send_all = function (ctype, body, not_uid) {
        return __awaiter(this, void 0, void 0, function () {
            var uids;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get_all_uids()];
                    case 1:
                        uids = _a.sent();
                        if (uids) {
                            uids.forEach(function (uid) {
                                if (uid != not_uid) {
                                    NetServer_1["default"].send_cmd(_this._session, Stype_1["default"].S_TYPE.GameHoodle, ctype, uid, _this._proto_type, body);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //发送消息
    Player.prototype.send_cmd = function (ctype, body) {
        if (!this._session) {
            Log_1["default"].error("send_cmd error, session is null!!");
            return;
        }
        NetServer_1["default"].send_cmd(this._session, Stype_1["default"].S_TYPE.GameHoodle, ctype, this._uid, this._proto_type, body);
    };
    //小球信息
    Player.prototype.get_uball_info = function () {
        return this._user_ball_info;
    };
    Player.prototype.set_uball_info = function (info) {
        this._user_ball_info = info;
    };
    //当前使用小球等级
    Player.prototype.get_uball_level = function () {
        return this._user_config[GameHoodleConfig_1["default"].USER_BALL_LEVEL_STR];
    };
    Player.prototype.set_uball_level = function (level) {
        this._user_config[GameHoodleConfig_1["default"].USER_BALL_LEVEL_STR] = level;
    };
    //设置玩家状态
    Player.prototype.set_user_state = function (user_state) {
        this._user_state = user_state;
    };
    //获取玩家状态
    Player.prototype.get_user_state = function () {
        return this._user_state;
    };
    //设置位置
    Player.prototype.set_user_pos = function (pos) {
        this._user_pos = pos;
    };
    //获取位置
    Player.prototype.get_user_pos = function () {
        return this._user_pos;
    };
    Player.prototype.set_user_power = function (power) {
        this._user_power = power;
    };
    Player.prototype.get_user_power = function () {
        return this._user_power;
    };
    Player.prototype.set_user_score = function (score) {
        this._user_score = score;
    };
    Player.prototype.get_user_score = function () {
        return this._user_score;
    };
    //玩家信息汇总
    Player.prototype.get_player_info = function () {
        var info = _super.prototype.get_player_info.call(this);
        info.userstate = this._user_state;
        info.userpos = this._user_pos;
        info.userpower = this._user_power;
        info.userconfig = this._user_config;
        return info;
    };
    //清除玩家在房间内的相关信息
    Player.prototype.clear_room_info = function () {
        this.set_offline(false);
        this.set_ishost(false);
        this.set_seat_id(-1);
        this.set_user_state(State_1["default"].UserState.InView);
        this.set_user_power(0);
        this.set_user_score(0);
        this.set_user_pos({ posx: 0, posy: 0 });
    };
    return Player;
}(PlayerBase_1["default"]));
exports["default"] = Player;
//# sourceMappingURL=Player.js.map