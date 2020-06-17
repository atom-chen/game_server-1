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
var TimeUtil_1 = __importDefault(require("../utils/TimeUtil"));
var util = __importStar(require("util"));
var Log_1 = __importDefault(require("../utils/Log"));
var MAX_NUMBER_ID = 1000000;
var table_name = "uinfo";
var MySqlAuth = /** @class */ (function () {
    function MySqlAuth() {
    }
    MySqlAuth.engine = function () {
        return MySqlAuth.mysqlEngine;
    };
    MySqlAuth.connect = function (host, port, db_name, uname, upwd) {
        MySqlAuth.engine().connect(host, port, db_name, uname, upwd);
    };
    MySqlAuth.query = function (sql, callback) {
        MySqlAuth.engine().mysql_query(sql, callback);
    };
    MySqlAuth.async_query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlAuth.engine().async_query(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.login_by_uname_upwd = function (uname, upwd) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select uname, upwd ,uid from uinfo where uname = \"%s\" and upwd = \"%s\" and is_guest = 0 limit 1";
                        sql_cmd = util.format(sql, uname, upwd);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: 
                    // Log.info("sql: " , sql_cmd)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.login_by_guestkey = function (guestkey) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select guest_key , uid from uinfo where guest_key = \"%s\" limit 1";
                        sql_cmd = util.format(sql, guestkey);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //wechat login
    MySqlAuth.login_by_wechat_unionid = function (unionid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select unionid , uid from uinfo where unionid = \"%s\" limit 1";
                        sql_cmd = util.format(sql, unionid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.get_uinfo_by_uname_upwd = function (uname, upwd) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(uname && upwd && uname != "" && upwd != "")) return [3 /*break*/, 2];
                        sql = "select * from uinfo where uname = \"%s\" and upwd = \"%s\" and is_guest = 0 limit 1";
                        sql_cmd = util.format(sql, uname, upwd);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.get_uinfo_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select * from uinfo where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.insert_wechat_user = function (unick, usex, address, unionid, avatarurl) {
        return __awaiter(this, void 0, void 0, function () {
            var maxuid, max_numid, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlAuth.get_max_uid()];
                    case 1:
                        maxuid = _a.sent();
                        if (!!util.isNullOrUndefined(maxuid)) return [3 /*break*/, 3];
                        max_numid = MAX_NUMBER_ID + maxuid + 1;
                        Log_1["default"].info("insert_uname_upwd_user>> numid: ", max_numid);
                        sql = "insert into uinfo(`unick`, `usex`, `address` ,`numberid`, `unionid`, `avatarurl`)values(\"%s\", %d, \"%s\", %d, \"%s\",\"%s\")";
                        sql_cmd = util.format(sql, unick, usex, address, max_numid, unionid, avatarurl);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 2: 
                    // Log.info("insert_uname_upwd_user>> sql: ", sql_cmd);
                    return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.insert_uname_upwd_user = function (uname, upwdmd5, unick, uface, usex) {
        return __awaiter(this, void 0, void 0, function () {
            var maxuid, max_numid, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlAuth.get_max_uid()];
                    case 1:
                        maxuid = _a.sent();
                        if (!!util.isNullOrUndefined(maxuid)) return [3 /*break*/, 3];
                        max_numid = MAX_NUMBER_ID + maxuid + 1;
                        unick = unick + String(max_numid);
                        sql = "insert into uinfo(`uname`, `upwd` ,`unick`, `uface`, `usex`, `numberid`, `guest_key`)values(\"%s\", \"%s\", \"%s\", %d, %d, %d,0)";
                        sql_cmd = util.format(sql, uname, upwdmd5, unick, uface, usex, max_numid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 2: 
                    // Log.info("insert_uname_upwd_user>> sql: ", sql_cmd);
                    return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.insert_guest_user = function (unick, uface, usex, ukey) {
        return __awaiter(this, void 0, void 0, function () {
            var maxuid, max_numid, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlAuth.get_max_uid()];
                    case 1:
                        maxuid = _a.sent();
                        if (!!util.isNullOrUndefined(maxuid)) return [3 /*break*/, 3];
                        max_numid = MAX_NUMBER_ID + maxuid + 1;
                        unick = unick + String(max_numid);
                        sql = "insert into uinfo(`guest_key`, `unick`, `uface`, `usex`, `numberid`, `is_guest`)values(\"%s\", \"%s\", %d, %d, %d,1)";
                        sql_cmd = util.format(sql, ukey, unick, uface, usex, max_numid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.check_uname_exist = function (uname) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd, sql_ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select uid from uinfo where binary uname = \"%s\"";
                        sql_cmd = util.format(sql, uname);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            if (sql_ret.length <= 0) {
                                return [2 /*return*/, false];
                            }
                            else {
                                if (!util.isNullOrUndefined(sql_ret[0].uid)) {
                                    return [2 /*return*/, true];
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.get_max_uid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql_cmd, sql_ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql_cmd = "select uid from uinfo order by uid desc";
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            if (sql_ret.length <= 0) {
                                return [2 /*return*/, 0];
                            }
                            else {
                                return [2 /*return*/, sql_ret[0].uid];
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.update_wechat_user_info = function (uid, unick, usex, address, unionid, avatarurl) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update uinfo set unick = \"%s\", usex = %d, address = \"%s\", unionid = \"%s\" ,avatarurl = \"%s\" where uid = %d";
                        sql_cmd = util.format(sql, unick, usex, address, unionid, avatarurl, uid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.get_guest_uinfo_by_guestkey = function (guestkey) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select * from uinfo where guest_key = \"%s\" limit 1";
                        sql_cmd = util.format(sql, guestkey);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.insert_phone_account_user = function (unick, uface, usex, phone, pwd_md5) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "insert into uinfo(`uname`, `upwd`, `unick`, `uface`, `usex`, `is_guest`)values(\"%s\", \"%s\", \"%s\", %d, %d, 0)";
                        sql_cmd = util.format(sql, phone, pwd_md5, unick, uface, usex);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.edit_profile = function (uid, unick, usex, uface) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update uinfo set unick = \"%s\", usex = %d, uface = %d where uid = %d";
                        sql_cmd = util.format(sql, unick, usex, uid, uface);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.is_exist_guest = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd, sql_ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select is_guest, status from uinfo where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            if (sql_ret.length <= 0) {
                                return [2 /*return*/, false];
                            }
                            else {
                                if (sql_ret[0].is_guest === 1 && sql_ret[0].status === 0) {
                                    return [2 /*return*/, true];
                                }
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    MySqlAuth._is_phone_indentify_exist = function (phone, opt) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd, sql_ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select id from phone_chat where phone = \"%s\" and opt_type = %d";
                        sql_cmd = util.format(sql, phone, opt);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            if (sql_ret.length <= 0) {
                                return [2 /*return*/, false];
                            }
                            else {
                                return [2 /*return*/, true];
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    MySqlAuth._update_phone_indentify_time = function (code, phone, opt, end_duration) {
        return __awaiter(this, void 0, void 0, function () {
            var end_time, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        end_time = TimeUtil_1["default"].timestamp() + end_duration;
                        sql = "update phone_chat set code = \"%s\", end_time=%d, count=count+1 where phone = \"%s\" and opt_type = %d";
                        sql_cmd = util.format(sql, code, end_time, phone, opt);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth._insert_phone_indentify = function (code, phone, opt, end_duration) {
        return __awaiter(this, void 0, void 0, function () {
            var end_time, sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        end_time = TimeUtil_1["default"].timestamp() + end_duration;
                        sql = "insert into phone_chat(`code`, `phone`, `opt_type`, `end_time`, `count`)values(\"%s\", \"%s\", %d, %d, 1)";
                        sql_cmd = util.format(sql, code, phone, opt, end_time);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.update_phone_indentify = function (code, phone, opt, end_duration, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var b_exisit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlAuth._is_phone_indentify_exist(phone, opt)];
                    case 1:
                        b_exisit = _a.sent();
                        if (!b_exisit) return [3 /*break*/, 3];
                        return [4 /*yield*/, MySqlAuth._update_phone_indentify_time(code, phone, opt, end_duration)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, MySqlAuth._insert_phone_indentify(code, phone, opt, end_duration)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MySqlAuth.do_upgrade_guest_account = function (uid, uname, upwd, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update uinfo set uname = \"%s\", upwd = \"%s\", is_guest = 0 where uid = %d";
                        sql_cmd = util.format(sql, uname, upwd, uid);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.reset_account_pwd = function (uname, upwd, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update uinfo set upwd = \"%s\" where uname = \"%s\"";
                        sql_cmd = util.format(sql, upwd, uname);
                        return [4 /*yield*/, MySqlAuth.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlAuth.mysqlEngine = new MySqlEngine_1["default"]();
    return MySqlAuth;
}());
exports["default"] = MySqlAuth;
//# sourceMappingURL=MySqlAuth.js.map