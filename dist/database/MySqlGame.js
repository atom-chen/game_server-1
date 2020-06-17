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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var MySqlEngine_1 = __importDefault(require("./MySqlEngine"));
var util = __importStar(require("util"));
var Log_1 = __importDefault(require("../utils/Log"));
var querystring_1 = __importDefault(require("querystring"));
var GameHoodleConfig_1 = __importDefault(require("../apps/game_server/game_hoodle/config/GameHoodleConfig"));
var table_name = "ugame";
var MySqlGame = /** @class */ (function () {
    function MySqlGame() {
    }
    MySqlGame.engine = function () {
        return MySqlGame.mysqlEngine;
    };
    MySqlGame.connect = function (host, port, db_name, uname, upwd) {
        MySqlGame.engine().connect(host, port, db_name, uname, upwd);
    };
    MySqlGame.query = function (sql, callback) {
        MySqlGame.engine().mysql_query(sql, callback);
    };
    MySqlGame.async_query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlGame.engine().async_query(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //查找所有字段（一般不建议用这个接口，效率较低）
    MySqlGame.get_ugame_info_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select * from ugame where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //查找玩家金币
    MySqlGame.get_ugame_uchip_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select uchip from ugame where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //创建玩家游戏信息
    MySqlGame.insert_ugame_user = function (uid, uexp, uchip) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "insert into ugame(`uid`, `uexp`, `uchip`, `uball_info`)values(%d, %d, %d, \"%s\")";
                        sql_cmd = util.format(sql, uid, uexp, uchip, GameHoodleConfig_1["default"].KW_BORN_USER_BALL);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: 
                    // Log.info("hcc>>insert: ", sql_cmd)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // 玩家金币修改
    // 有增加,也减少
    MySqlGame.add_ugame_uchip = function (uid, uchip) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (uchip < 0) {
                            uchip = Math.abs(uchip) * (-1); // 负数
                        }
                        sql = "update ugame set uchip = uchip + %d where uid = %d";
                        sql_cmd = util.format(sql, uchip, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //获得玩家小球信息字符串: querystirng串
    //外层调用querystring.decode()去解码,解码成对象
    //对象可以用json转成字符串
    MySqlGame.get_ugame_uball_info = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select uball_info from ugame where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //设置玩家小球信息 uball_obj_json: json字符串
    //uball_obj_json小球集合对象转成json字符串:uball_obj = {lv_1:1,lv_2:2,lv_3:0}
    //querystring.encode() 转成 "lv_1=0&lv_2=1&lv_3=3&lv_4=4&lv_5=155"
    MySqlGame.update_ugame_uball_info = function (uid, uball_obj_json) {
        return __awaiter(this, void 0, void 0, function () {
            var uball_qstring, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uball_qstring = "";
                        try {
                            uball_qstring = querystring_1["default"].encode(JSON.parse(uball_obj_json));
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                            return [2 /*return*/];
                        }
                        if (uball_qstring == "") {
                            Log_1["default"].warn("update_ugame_uball_info quertstring error");
                            return [2 /*return*/];
                        }
                        sql = "update ugame set uball_info = \"%s\" where uid = %d";
                        sql_cmd = util.format(sql, uball_qstring, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //查找玩家游戏配置
    MySqlGame.get_ugame_config_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select user_config from ugame where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //更新玩家配置
    MySqlGame.update_ugame_user_config = function (uid, user_config_json) {
        return __awaiter(this, void 0, void 0, function () {
            var uconfig_qstring, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uconfig_qstring = "";
                        try {
                            uconfig_qstring = querystring_1["default"].encode(JSON.parse(user_config_json));
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                            return [2 /*return*/];
                        }
                        if (uconfig_qstring == "") {
                            Log_1["default"].warn("update_ugame_user_config quertstring error");
                            return [2 /*return*/];
                        }
                        sql = "update ugame set user_config = \"%s\" where uid = %d";
                        sql_cmd = util.format(sql, uconfig_qstring, uid);
                        return [4 /*yield*/, MySqlGame.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlGame.mysqlEngine = new MySqlEngine_1["default"]();
    return MySqlGame;
}());
exports["default"] = MySqlGame;
//# sourceMappingURL=MySqlGame.js.map