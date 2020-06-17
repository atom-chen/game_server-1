import MySqlEngine from "./MySqlEngine"
import * as util from "util"
import Log from '../utils/Log';
import querystring from "querystring"
import GameHoodleConfig from '../apps/game_server/game_hoodle/config/GameHoodleConfig';

let table_name = "ugame";

class MySqlGame {
	private static mysqlEngine: MySqlEngine = new MySqlEngine();

	static engine(){
		return MySqlGame.mysqlEngine;
	}

	static connect(host:string, port:number, db_name:string, uname:string, upwd:string) {
		MySqlGame.engine().connect(host,port,db_name,uname,upwd);
	}

	static query(sql:string, callback:Function){
		MySqlGame.engine().mysql_query(sql, callback);
    }

    static async async_query(sql: string) {
        return await MySqlGame.engine().async_query(sql);
    }

    //查找所有字段（一般不建议用这个接口，效率较低）
    static async get_ugame_info_by_uid(uid:number) {
        let sql = "select * from ugame where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        return await MySqlGame.async_query(sql_cmd);
    }
    
    //查找玩家金币
    static async get_ugame_uchip_by_uid(uid:number){
        let sql = "select uchip from ugame where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        return await MySqlGame.async_query(sql_cmd);
    }

    //创建玩家游戏信息
    static async insert_ugame_user(uid:number, uexp:number, uchip:number) {
        let sql = "insert into ugame(`uid`, `uexp`, `uchip`, `uball_info`)values(%d, %d, %d, \"%s\")";
        let sql_cmd = util.format(sql, uid, uexp, uchip, GameHoodleConfig.KW_BORN_USER_BALL);
        // Log.info("hcc>>insert: ", sql_cmd)
        return await MySqlGame.async_query(sql_cmd);
    }

    // 玩家金币修改
    // 有增加,也减少
    static async add_ugame_uchip(uid:number, uchip:number) {
        if(uchip < 0){
            uchip = Math.abs(uchip) * (-1); // 负数
        }

        let sql = "update ugame set uchip = uchip + %d where uid = %d";
        let sql_cmd = util.format(sql, uchip, uid);
        return await MySqlGame.async_query(sql_cmd);
    }

    //获得玩家小球信息字符串: querystirng串
    //外层调用querystring.decode()去解码,解码成对象
    //对象可以用json转成字符串
    static async get_ugame_uball_info(uid:number){
        let sql = "select uball_info from ugame where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        return await MySqlGame.async_query(sql_cmd);
    }

    //设置玩家小球信息 uball_obj_json: json字符串
    //uball_obj_json小球集合对象转成json字符串:uball_obj = {lv_1:1,lv_2:2,lv_3:0}
    //querystring.encode() 转成 "lv_1=0&lv_2=1&lv_3=3&lv_4=4&lv_5=155"
    static async update_ugame_uball_info(uid:number, uball_obj_json:string){
        let uball_qstring = "";
        try {
            uball_qstring = querystring.encode(JSON.parse(uball_obj_json));
        } catch (error) {
            Log.error(error);
            return;
        }
        
        if(uball_qstring == ""){
            Log.warn("update_ugame_uball_info quertstring error");
            return;
        }

        let sql = "update ugame set uball_info = \"%s\" where uid = %d";
        let sql_cmd = util.format(sql, uball_qstring ,uid);
        return await MySqlGame.async_query(sql_cmd);
    }

    //查找玩家游戏配置
    static async get_ugame_config_by_uid(uid: number) {
        let sql = "select user_config from ugame where uid = %d limit 1";
        let sql_cmd = util.format(sql, uid);
        return await MySqlGame.async_query(sql_cmd);
    }

    //更新玩家配置
    static async update_ugame_user_config(uid: number, user_config_json: string) {
        let uconfig_qstring = "";
        try {
            uconfig_qstring = querystring.encode(JSON.parse(user_config_json));
        } catch (error) {
            Log.error(error);
            return;
        }

        if (uconfig_qstring == "") {
            Log.warn("update_ugame_user_config quertstring error");
            return;
        }

        let sql = "update ugame set user_config = \"%s\" where uid = %d";
        let sql_cmd = util.format(sql, uconfig_qstring, uid);
        return await MySqlGame.async_query(sql_cmd);
    }

}

export default MySqlGame;