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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var mysql = __importStar(require("mysql"));
var Log_1 = __importDefault(require("../utils/Log"));
var util = __importStar(require("util"));
var MySqlEngine = /** @class */ (function () {
    function MySqlEngine() {
        this._conn_pool = null;
        this._host = "";
        this._port = 0;
        this._db_name = "";
        this._uname = "";
        this._upwd = "";
    }
    MySqlEngine.prototype.connect = function (host, port, db_name, uname, upwd) {
        this._host = host;
        this._port = port;
        this._db_name = db_name;
        this._uname = uname;
        this._upwd = upwd;
        this._conn_pool = mysql.createPool({
            host: host,
            port: port,
            database: db_name,
            user: uname,
            password: upwd
        });
    };
    //查询sql，直接使用Pool.query接口，自动release
    MySqlEngine.prototype.mysql_query = function (sql, callback) {
        if (!this._conn_pool) {
            Log_1["default"].error("mysql Pool is null");
            return;
        }
        this._conn_pool.query(sql, function (sql_err, sql_result, fields_desic) {
            if (sql_err) {
                if (callback) {
                    callback(sql_err, null, null);
                }
                return;
            }
            if (callback) {
                callback(null, sql_result, fields_desic);
            }
        });
    };
    MySqlEngine.prototype.async_query = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var asnyc_query_func, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._conn_pool) {
                            Log_1["default"].error("mysql Pool is null");
                            return [2 /*return*/];
                        }
                        asnyc_query_func = util.promisify(this._conn_pool.query);
                        if (!asnyc_query_func) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, asnyc_query_func.call(this._conn_pool, sql)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _a.sent();
                        Log_1["default"].error("hcc>>async_query_error: ", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MySqlEngine.prototype.get_mysql_info = function () {
        var info = {
            host: this._host,
            port: this._port,
            db_name: this._db_name,
            uname: this._uname,
            upwd: this._upwd
        };
        return info;
    };
    return MySqlEngine;
}());
exports["default"] = MySqlEngine;
//# sourceMappingURL=MySqlEngine.js.map