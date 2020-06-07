"use strict";
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
var Response_1 = __importDefault(require("../apps/protocol/Response"));
var Log_1 = __importDefault(require("../utils/Log"));
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
    MySqlSystem.get_login_bonues_info_by_uid = function (uid, callback) {
        var sql = "select bonues, bonues_time, days, status from login_bonues where uid = %d limit 1";
        var sql_cmd = util.format(sql, uid);
        MySqlSystem.query(sql_cmd, function (err, sql_ret, fields_desic) {
            if (err) {
                callback(Response_1["default"].SYSTEM_ERR, err);
                return;
            }
            callback(Response_1["default"].OK, sql_ret);
        });
    };
    MySqlSystem.insert_login_bonues_info = function (uid, bonues, bonues_time, days, status, callback) {
        var sql = "insert into login_bonues(`uid`, `bonues`, `bonues_time`, `days`, `status`)values(%d, %d, %d, %d, %d)";
        var sql_cmd = util.format(sql, uid, bonues, bonues_time, days, status);
        Log_1["default"].info("hcc>>insert: ", sql_cmd);
        MySqlSystem.query(sql_cmd, function (err, sql_ret, fields_desic) {
            if (err) {
                callback(Response_1["default"].SYSTEM_ERR, err);
                return;
            }
            callback(Response_1["default"].OK);
        });
    };
    MySqlSystem.update_login_bonues_info = function (uid, bonues, bonues_time, days, status, callback) {
        var sql = "update login_bonues set bonues = %d, bonues_time = %d, days = %d, status = %d where uid = %d";
        var sql_cmd = util.format(sql, bonues, bonues_time, days, status, uid);
        MySqlSystem.query(sql_cmd, function (err, sql_ret, fields_desic) {
            if (err) {
                if (callback) {
                    callback(Response_1["default"].SYSTEM_ERR, err);
                }
                return;
            }
            if (callback) {
                callback(Response_1["default"].OK);
            }
        });
    };
    MySqlSystem.mysqlEngine = new MySqlEngine_1["default"]();
    return MySqlSystem;
}());
exports["default"] = MySqlSystem;
//# sourceMappingURL=MysqlSystem.js.map