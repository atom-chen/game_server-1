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
var NetServer_1 = __importDefault(require("../../../netbus/NetServer"));
var MySqlAuth_1 = __importDefault(require("../../../database/MySqlAuth"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var State_1 = require("../config/State");
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var Stype_1 = __importDefault(require("../../protocol/Stype"));
var Player = /** @class */ (function () {
    function Player() {
        //玩家基础信息
        this._uid = 0;
        this._session = null;
        this._proto_type = -1;
        this._ugame_info = {};
        this._ucenter_info = {};
        this._is_robot = false;
        //房间相关
        this._is_off_line = false;
        this._is_host = false;
        this._seat_id = -1;
        //居内数据
        this._user_state = State_1.UserState.InView; //玩家状态
        this._user_pos = { posx: 0, posy: 0 }; //玩家位置 
        this._user_power = 0; //玩家权限
        this._user_score = 0; //玩家得分
        this._user_ball_info = ""; //json串，玩家小球信息
        //玩家配置（身上的装备，弹珠等级，等等）
        this._user_config = {};
        //test
        // this._ugame_info["test_gameinfo"] = "info_test";
        // this._ugame_info["test_gameinfo2"] = "info_test2";
        // this._ugame_info["test_gameinfo3"] = false;
    }
    //中心数据，游戏数据 auth_center->uinfo
    Player.prototype.init_session = function (session, uid, proto_type) {
        return __awaiter(this, void 0, void 0, function () {
            var data, sql_info;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._session = session;
                        this._uid = uid;
                        this._proto_type = proto_type;
                        return [4 /*yield*/, MySqlAuth_1["default"].get_uinfo_by_uid(uid)];
                    case 1:
                        data = _a.sent();
                        // Log.info("hcc>>init_session: " , data);
                        if (data && data.length > 0) {
                            sql_info = data[0];
                            this._ucenter_info = sql_info;
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    //获取uid
    Player.prototype.get_uid = function () {
        return this._uid;
    };
    Player.prototype.get_proto_type = function () {
        return this._proto_type;
    };
    //获取numid
    Player.prototype.get_numberid = function () {
        return this._ucenter_info.numberid;
    };
    //设置游戏局内信息
    Player.prototype.set_ugame_info = function (ugame_info) {
        this._ugame_info = ugame_info;
    };
    //游戏服务信息
    Player.prototype.get_ugame_info = function () {
        return this._ugame_info;
    };
    //玩家中心信息
    Player.prototype.get_ucenter_info = function () {
        return this._ucenter_info;
    };
    //账号
    Player.prototype.get_uname = function () {
        return this._ucenter_info.uname;
    };
    //玩家名字
    Player.prototype.get_unick = function () {
        return this._ucenter_info.unick;
    };
    //金币
    Player.prototype.get_uchip = function () {
        return this._ugame_info.uchip;
    };
    //金币
    Player.prototype.set_uchip = function (uchip) {
        this._ugame_info.uchip = uchip;
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
    Player.prototype.set_user_config = function (config) {
        this._user_config = config;
    };
    Player.prototype.get_user_config = function () {
        return this._user_config;
    };
    //设置是否掉线
    Player.prototype.set_offline = function (is_offline) {
        this._is_off_line = is_offline;
    };
    //获取是否掉线
    Player.prototype.get_offline = function () {
        return this._is_off_line;
    };
    //设置是否房主
    Player.prototype.set_ishost = function (is_host) {
        this._is_host = is_host;
    };
    //获取是否房主
    Player.prototype.get_ishost = function () {
        return this._is_host;
    };
    //设置玩家座位号
    Player.prototype.set_seat_id = function (seatid) {
        this._seat_id = seatid;
    };
    //获取玩家座位号
    Player.prototype.get_seat_id = function () {
        return this._seat_id;
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
    Player.prototype.is_robot = function () {
        return this._is_robot;
    };
    Player.prototype.set_robot = function (is_robot) {
        this._is_robot = is_robot;
    };
    //玩家信息汇总
    Player.prototype.get_player_info = function () {
        var info = ArrayUtil_1["default"].ObjCat(this._ugame_info, this._ucenter_info);
        info.isoffline = this._is_off_line;
        info.ishost = this._is_host;
        info.seatid = this._seat_id;
        info.userstate = this._user_state;
        info.userpos = this._user_pos;
        info.userpower = this._user_power;
        info.userconfig = this._user_config;
        return info;
    };
    //重连后拷贝老玩家的信息
    Player.prototype.set_player_info = function (uinfo) {
        this._is_off_line = uinfo.isoffline;
        this._is_host = uinfo.ishost;
        this._seat_id = uinfo.seatid;
        this._user_state = uinfo.userstate;
        this._user_pos = uinfo.userpos;
        this._user_power = uinfo.userpower;
        this._user_config = uinfo.userconfig;
    };
    //清除玩家在房间内的相关信息
    Player.prototype.clear_room_info = function () {
        this.set_offline(false);
        this.set_ishost(false);
        this.set_seat_id(-1);
        this.set_user_state(State_1.UserState.InView);
        this.set_user_power(0);
        this.set_user_score(0);
        this.set_user_pos({ posx: 0, posy: 0 });
    };
    //发送消息
    Player.prototype.send_cmd = function (ctype, body) {
        if (!this._session) {
            Log_1["default"].error("send_cmd error, session is null!!");
            return;
        }
        NetServer_1["default"].send_cmd(this._session, Stype_1["default"].S_TYPE.GameHoodle, ctype, this._uid, this._proto_type, body);
    };
    return Player;
}());
exports["default"] = Player;
//# sourceMappingURL=Player.js.map