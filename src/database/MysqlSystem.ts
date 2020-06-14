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

    static async async_query(sql: string){
         return await MySqlSystem.engine().async_query(sql);
    }

    static async get_login_bonues_info_by_uid(uid: number) {
        let sql = "select bonues, bonues_time, days, status from login_bonues where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        return await MySqlSystem.async_query(sql_cmd);
    }
    
    static async insert_login_bonues_info(uid: number, bonues: number, bonues_time: number, days: number, status: number) {
        let sql = "insert into login_bonues(`uid`, `bonues`, `bonues_time`, `days`, `status`)values(%d, %d, %d, %d, %d)";
        let sql_cmd = util.format(sql, uid, bonues, bonues_time, days, status);
        Log.info("hcc>>insert: ", sql_cmd)
        return await MySqlSystem.async_query(sql_cmd);
    }

    static async update_login_bonues_info(uid: number, bonues: number, bonues_time: number, days: number, status: number) {
        let sql = "update login_bonues set bonues = %d, bonues_time = %d, days = %d, status = %d where uid = %d";
        let sql_cmd = util.format(sql, bonues, bonues_time, days, status, uid);
        return await MySqlSystem.async_query(sql_cmd);
    }

    //test async 函数
    static async test_func(uid: number){
        // let sql = "select * from login_bonues where uid = %d limit 1";
        // let sql = "select fuck from login_bonues where uid = %d limit 1";
        // let sql_cmd = util.format(sql, uid);
        // return await MySqlSystem.async_query(sql_cmd);
        // let ret_insert = await MySqlSystem.insert_login_bonues_info(uid, 0, 0, 0, 0);
        let ret_update = await MySqlSystem.update_login_bonues_info(uid, 0, 100, 0, 0);
        Log.info("test_func.........");
        return ret_update;
    }

}

export default MySqlSystem;