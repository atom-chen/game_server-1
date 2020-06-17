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
var table_name = "login_bonues";
var MySqlSystem = /** @class */ (function () {
    function MySqlSystem() {
    }
    MySqlSystem.engine = function () {
        return MySqlSystem.mysqlEngine;
    };
    MySqlSystem.connect = function (host, port, db_name, uname, upwd) {
        MySqlSystem.engine().connect(host, port, db_name, uname, upwd);
    };
    MySqlSystem.query = function (sql, callback) {
        MySqlSystem.engine().mysql_query(sql, callback);
    };
    MySqlSystem.async_query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlSystem.engine().async_query(sql)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlSystem.get_login_bonues_info_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "select bonues, bonues_time, days, status from login_bonues where uid = %d limit 1";
                        sql_cmd = util.format(sql, uid);
                        return [4 /*yield*/, MySqlSystem.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlSystem.insert_login_bonues_info = function (uid, bonues, bonues_time, days, status) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "insert into login_bonues(`uid`, `bonues`, `bonues_time`, `days`, `status`)values(%d, %d, %d, %d, %d)";
                        sql_cmd = util.format(sql, uid, bonues, bonues_time, days, status);
                        return [4 /*yield*/, MySqlSystem.async_query(sql_cmd)];
                    case 1: 
                    // Log.info("hcc>>insert: ", sql_cmd)
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MySqlSystem.update_login_bonues_info = function (uid, bonues, bonues_time, days, status) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, sql_cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "update login_bonues set bonues = %d, bonues_time = %d, days = %d, status = %d where uid = %d";
                        sql_cmd = util.format(sql, bonues, bonues_time, days, status, uid);
                        return [4 /*yield*/, MySqlSystem.async_query(sql_cmd)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //test async 函数
    MySqlSystem.test_func = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var ret_update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlSystem.update_login_bonues_info(uid, 0, 100, 0, 0)];
                    case 1:
                        ret_update = _a.sent();
                        // Log.info("test_func.........");
                        return [2 /*return*/, ret_update];
                }
            });
        });
    };
    MySqlSystem.mysqlEngine = new MySqlEngine_1["default"]();
    return MySqlSystem;
}());
exports["default"] = MySqlSystem;
//# sourceMappingURL=MysqlSystem.js.map