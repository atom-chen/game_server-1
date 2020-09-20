import MySqlEngine from "../utils/MySqlEngine"
import TimeUtil from '../utils/TimeUtil';
import * as util from "util"
import Log from '../utils/Log';

let MAX_NUMBER_ID = 1000000;
let table_name = "uinfo";

class MySqlAuth {
	private static mysqlEngine: MySqlEngine = new MySqlEngine();

	static engine(){
		return MySqlAuth.mysqlEngine;
	}

	static connect(host:string, port:number, db_name:string, uname:string, upwd:string) {
		MySqlAuth.engine().connect(host,port,db_name,uname,upwd);
	}

	static query(sql:string, callback:Function){
		MySqlAuth.engine().mysql_query(sql, callback);
	}

	static async async_query(sql: string) {
		return await MySqlAuth.engine().async_query(sql);
	}

	static async login_by_uname_upwd(uname:string, upwd:string){
		let sql = "select uname, upwd ,uid from uinfo where uname = \"%s\" and upwd = \"%s\" and is_guest = 0 limit 1";
		let sql_cmd = util.format(sql, uname, upwd);
		// Log.info("sql: " , sql_cmd)
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async login_by_guestkey(guestkey:string){
		let sql = "select guest_key , uid from uinfo where guest_key = \"%s\" limit 1";
		let sql_cmd = util.format(sql, guestkey);
		return await MySqlAuth.async_query(sql_cmd);
	}

	//wechat login
	static async login_by_wechat_unionid(unionid:string){
		let sql = "select unionid , uid from uinfo where unionid = \"%s\" limit 1";
		let sql_cmd = util.format(sql, unionid);
		return await MySqlAuth.async_query(sql_cmd);
	}
	
	static async get_uinfo_by_uname_upwd(uname:string, upwd:string) {
		if(uname && upwd && uname != "" && upwd != ""){
			let sql = "select * from uinfo where uname = \"%s\" and upwd = \"%s\" and is_guest = 0 limit 1";
			let sql_cmd = util.format(sql, uname, upwd);
			return await MySqlAuth.async_query(sql_cmd);
		}
	}

	static async get_uinfo_by_uid(uid:number){
		let sql = "select * from uinfo where uid = %d limit 1";
		let sql_cmd = util.format(sql, uid);
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async insert_wechat_user(unick: string, usex: number, address:string, unionid:string , avatarurl:string) {
		let maxuid = await MySqlAuth.get_max_uid();
		if (!util.isNullOrUndefined(maxuid)){
			let max_numid = MAX_NUMBER_ID + maxuid + 1;
			Log.info("insert_uname_upwd_user>> numid: ", max_numid);
			let sql = "insert into uinfo(`unick`, `usex`, `address` ,`numberid`, `unionid`, `avatarurl`)values(\"%s\", %d, \"%s\", %d, \"%s\",\"%s\")";
			let sql_cmd = util.format(sql, unick, usex, address, max_numid, unionid, avatarurl);
			// Log.info("insert_uname_upwd_user>> sql: ", sql_cmd);
			return await MySqlAuth.async_query(sql_cmd);
		}
	}

	static async insert_uname_upwd_user(uname:string , upwdmd5:string ,unick:string, uface:number, usex:number){
		let maxuid = await MySqlAuth.get_max_uid();
		if (!util.isNullOrUndefined(maxuid)) {
			let max_numid = MAX_NUMBER_ID + maxuid + 1;
			unick = unick + String(max_numid);
			// Log.info("insert_uname_upwd_user>> numid: ", max_numid)
			let sql = "insert into uinfo(`uname`, `upwd` ,`unick`, `uface`, `usex`, `numberid`, `guest_key`)values(\"%s\", \"%s\", \"%s\", %d, %d, %d,0)";
			let sql_cmd = util.format(sql, uname, upwdmd5, unick, uface, usex, max_numid);
			// Log.info("insert_uname_upwd_user>> sql: ", sql_cmd);
			return await MySqlAuth.async_query(sql_cmd);
		}
	}

	static async insert_guest_user(unick:string, uface:number, usex:number, ukey:string) {
		let maxuid = await MySqlAuth.get_max_uid();
		if (!util.isNullOrUndefined(maxuid)) {
			let max_numid = MAX_NUMBER_ID + maxuid + 1;
			unick = unick + String(max_numid);
			let sql = "insert into uinfo(`guest_key`, `unick`, `uface`, `usex`, `numberid`, `is_guest`)values(\"%s\", \"%s\", %d, %d, %d,1)";
			let sql_cmd = util.format(sql, ukey, unick, uface, usex, max_numid);
			return await MySqlAuth.async_query(sql_cmd);
		}
	}

	static async check_uname_exist(uname:string){
		let sql = "select uid from uinfo where binary uname = \"%s\""
		let sql_cmd = util.format(sql, uname);
		let sql_ret =  await MySqlAuth.async_query(sql_cmd);
		if (sql_ret){
			if(sql_ret.length <= 0){
				return false;
			}else{
				if(!util.isNullOrUndefined(sql_ret[0].uid)){
					return true;
				}
			}
		}
	}

	static async get_max_uid(){
		let sql_cmd = "select uid from uinfo order by uid desc"
		let sql_ret:any = await MySqlAuth.async_query(sql_cmd);
		if (sql_ret){
			if (sql_ret.length <= 0){
				return 0;
			}else{
				return sql_ret[0].uid;
			}
		}
	}

	static async update_wechat_user_info(uid:number, unick: string, usex: number, address: string, unionid: string, avatarurl: string){
		let sql = "update uinfo set unick = \"%s\", usex = %d, address = \"%s\", unionid = \"%s\" ,avatarurl = \"%s\" where uid = %d";
		let sql_cmd = util.format(sql, unick, usex, address, unionid, avatarurl, uid);
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async get_guest_uinfo_by_guestkey(guestkey:string) {
		let sql = "select * from uinfo where guest_key = \"%s\" limit 1";
		let sql_cmd = util.format(sql, guestkey);
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async insert_phone_account_user(unick:string, uface:number, usex:number, phone:string, pwd_md5:string) {
		let sql = "insert into uinfo(`uname`, `upwd`, `unick`, `uface`, `usex`, `is_guest`)values(\"%s\", \"%s\", \"%s\", %d, %d, 0)";
		let sql_cmd = util.format(sql, phone, pwd_md5, unick, uface, usex);
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async edit_profile(uid:number, unick:string, usex:number, uface:number) {
		let sql = "update uinfo set unick = \"%s\", usex = %d, uface = %d where uid = %d";
		let sql_cmd = util.format(sql, unick, usex, uid, uface);
		return await MySqlAuth.async_query(sql_cmd);
	}

	static async is_exist_guest(uid:number) {
		let sql = "select is_guest, status from uinfo where uid = %d limit 1";
		let sql_cmd = util.format(sql, uid);
		let sql_ret:any = await MySqlAuth.async_query(sql_cmd);
		if (sql_ret){
			if (sql_ret.length <= 0){
				return false;
			}else{
				if (sql_ret[0].is_guest === 1 && sql_ret[0].status === 0) {
					return true;
				}
			}
		}
		return false;
	}

	static async _is_phone_indentify_exist(phone:string, opt:number) {
		let sql = "select id from phone_chat where phone = \"%s\" and opt_type = %d";
		let sql_cmd = util.format(sql, phone, opt);
		let sql_ret: any = await MySqlAuth.async_query(sql_cmd);
		if (sql_ret){
			if (sql_ret.length <= 0){
				return false;
			}else{
				return true;
			}
		}
		return false;
	}

	static async _update_phone_indentify_time(code:string, phone:string, opt:number, end_duration:number) {
		let end_time = TimeUtil.timestamp() + end_duration;
		let sql = "update phone_chat set code = \"%s\", end_time=%d, count=count+1 where phone = \"%s\" and opt_type = %d";
		let sql_cmd = util.format(sql, code, end_time, phone, opt);
		return await MySqlAuth.async_query(sql_cmd);
	}
	
	static async _insert_phone_indentify(code:string, phone:string, opt:number, end_duration:number) {
		let end_time = TimeUtil.timestamp() + end_duration;
		let sql = "insert into phone_chat(`code`, `phone`, `opt_type`, `end_time`, `count`)values(\"%s\", \"%s\", %d, %d, 1)";
		let sql_cmd = util.format(sql, code, phone, opt, end_time);
		return await MySqlAuth.async_query(sql_cmd);
	}	
	
	static async update_phone_indentify(code:string, phone:string, opt:number, end_duration:number, callback:Function) {
		let b_exisit = await MySqlAuth._is_phone_indentify_exist(phone, opt);
		if (b_exisit){
			 await MySqlAuth._update_phone_indentify_time(code, phone, opt, end_duration);
		}else{
			await MySqlAuth._insert_phone_indentify(code, phone, opt, end_duration);
		}
	}

	static async do_upgrade_guest_account(uid:number, uname:string, upwd:string, callback:Function) {
		let sql = "update uinfo set uname = \"%s\", upwd = \"%s\", is_guest = 0 where uid = %d";
		let sql_cmd = util.format(sql, uname, upwd, uid);
		return await MySqlAuth.async_query(sql_cmd);
	}
	
	static async reset_account_pwd(uname:string, upwd:string, callback:Function) {
		let sql = "update uinfo set upwd = \"%s\" where uname = \"%s\"";
		let sql_cmd = util.format(sql, upwd, uname);
		return await MySqlAuth.async_query(sql_cmd);
	}

}

export default MySqlAuth;