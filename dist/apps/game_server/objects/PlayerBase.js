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
var ProtoTools_1 = __importDefault(require("../../../netengine/ProtoTools"));
var RedisAuth_1 = __importDefault(require("../../../database/RedisAuth"));
var RedisGame_1 = __importDefault(require("../../../database/RedisGame"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var PlayerBase = /** @class */ (function () {
    function PlayerBase(session, uid, proto_type) {
        //玩家基础信息
        this._uid = 0;
        this._session = null;
        this._proto_type = ProtoTools_1["default"].ProtoType.PROTO_BUF;
        this._auth_info = {};
        this._game_info = {};
        this._is_robot = false;
        //房间相关
        this._is_off_line = false;
        this._is_host = false;
        this._seat_id = -1;
        this._session = session,
            this._uid = uid;
        this._proto_type = proto_type;
    }
    PlayerBase.prototype.init_data = function (session, uid, proto_type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this._session = session,
                            this._uid = uid;
                        this._proto_type = proto_type;
                        _a = this;
                        return [4 /*yield*/, RedisAuth_1["default"].get_uinfo_inredis(this._uid)];
                    case 1:
                        _a._auth_info = _c.sent();
                        _b = this;
                        return [4 /*yield*/, RedisGame_1["default"].get_gameinfo_inredis(this._uid)];
                    case 2:
                        _b._game_info = _c.sent();
                        // Log.info("hcc>>init_session: _auth_info:", this._auth_info);
                        // Log.info("hcc>>init_session: _game_info:", this._game_info);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ///////////////////////////////// auth
    //玩家中心信息
    PlayerBase.prototype.get_auth_info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, RedisAuth_1["default"].get_uinfo_inredis(this._uid)];
                    case 1:
                        _a._auth_info = _b.sent();
                        return [2 /*return*/, this._auth_info];
                }
            });
        });
    };
    //获取uid
    PlayerBase.prototype.get_uid = function () {
        return this._uid;
    };
    PlayerBase.prototype.get_proto_type = function () {
        return this._proto_type;
    };
    //获取numid
    PlayerBase.prototype.get_numberid = function () {
        return this._auth_info.numberid;
    };
    //账号
    PlayerBase.prototype.get_uname = function () {
        return this._auth_info.uname;
    };
    //玩家名字
    PlayerBase.prototype.get_unick = function () {
        return this._auth_info.unick;
    };
    /////////////////////////////////game
    PlayerBase.prototype.get_game_info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, RedisGame_1["default"].get_gameinfo_inredis(this._uid)];
                    case 1:
                        _a._game_info = _b.sent();
                        return [2 /*return*/, this._game_info];
                }
            });
        });
    };
    //金币
    PlayerBase.prototype.get_uchip = function () {
        return this._game_info.uchip;
    };
    ///////////////////////////////// other data
    //设置是否掉线
    PlayerBase.prototype.set_offline = function (is_offline) {
        this._is_off_line = is_offline;
    };
    //获取是否掉线
    PlayerBase.prototype.get_offline = function () {
        return this._is_off_line;
    };
    //设置是否房主
    PlayerBase.prototype.set_ishost = function (is_host) {
        this._is_host = is_host;
    };
    //获取是否房主
    PlayerBase.prototype.get_ishost = function () {
        return this._is_host;
    };
    //设置玩家座位号
    PlayerBase.prototype.set_seat_id = function (seatid) {
        this._seat_id = seatid;
    };
    //获取玩家座位号
    PlayerBase.prototype.get_seat_id = function () {
        return this._seat_id;
    };
    PlayerBase.prototype.is_robot = function () {
        return this._is_robot;
    };
    PlayerBase.prototype.set_robot = function (is_robot) {
        this._is_robot = is_robot;
    };
    ///////////////////////
    //玩家信息汇总
    PlayerBase.prototype.get_player_info = function () {
        var allinfo = ArrayUtil_1["default"].ObjCat(this._auth_info, this._game_info);
        allinfo.isoffline = this._is_off_line;
        allinfo.ishost = this._is_host;
        allinfo.seatid = this._seat_id;
        return allinfo;
    };
    return PlayerBase;
}());
exports["default"] = PlayerBase;
//# sourceMappingURL=PlayerBase.js.map