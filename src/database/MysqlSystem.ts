import MySqlEngine from "./MySqlEngine"
import * as util from "util"
import Response from '../apps/protocol/Response';
import Log from '../utils/Log';

let table_name = "login_bonues";

class MySqlSystem {
    private static mysqlEngine: MySqlEngine = new MySqlEngine();

    static engine() {
        return MySqlSystem.mysqlEngine;
    }

    static connect(host: string, port: number, db_name: string, uname: string, upwd: string) {
        MySqlSystem.engine().connect(host, port, db_name, uname, upwd);
    }

    static query(sql: string, callback: Function) {
        MySqlSystem.engine().mysql_query(sql, callback);
    }

    static get_login_bonues_info_by_uid(uid: number, callback: Function) {
        var sql = "select bonues, bonues_time, days, status from login_bonues where uid = %d limit 1";
        var sql_cmd = util.format(sql, uid);
        MySqlSystem.query(sql_cmd, function (err: any, sql_ret: any, fields_desic: any) {
            if (err) {
                callback(Response.SYSTEM_ERR, err);
                return;
            }
            callback(Response.OK, sql_ret);
        });
    }

    static insert_login_bonues_info(uid:number, bonues:number, bonues_time:number, days:number, status:number, callback: Function) {
        var sql = "insert into login_bonues(`uid`, `bonues`, `bonues_time`, `days`, `status`)values(%d, %d, %d, %d, %d)";
        var sql_cmd = util.format(sql, uid, bonues, bonues_time, days, status);
        Log.info("hcc>>insert: ", sql_cmd)
        MySqlSystem.query(sql_cmd, function (err: any, sql_ret: any, fields_desic: any) {
            if (err) {
                callback(Response.SYSTEM_ERR, err);
                return;
            }
            callback(Response.OK);
        });
    }

    static update_login_bonues_info(uid: number, bonues: number, bonues_time: number, days: number, status: number, callback: Function){
        var sql = "update login_bonues set bonues = %d, bonues_time = %d, days = %d, status = %d where uid = %d";
        var sql_cmd = util.format(sql, bonues, bonues_time, days, status, uid);
        MySqlSystem.query(sql_cmd, function (err: any, sql_ret: any, fields_desic: any) {
            if (err) {
                if (callback) {
                    callback(Response.SYSTEM_ERR, err);
                }
                return;
            }
            if (callback) {
                callback(Response.OK)
            }
        })
    }

}

export default MySqlSystem;