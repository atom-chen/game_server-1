import RedisEngine from "../utils/RedisEngine";
import Log from "../utils/Log";

let auth_center_key = "auth_center_user_uid_";

export default class RedisAuth {
    private static redisEngine: RedisEngine = new RedisEngine();

    static engine() {
        return RedisAuth.redisEngine;
    }

    static connect(host?: string, port?: number, db_index?:number) {
        RedisAuth.engine().connect(host, port, db_index);
    }

    //uinfo: table
    static async set_uinfo_inredis(uid:number, uinfo:any) {
        let key = auth_center_key + uid;
        let ret = await RedisAuth.engine().hmset(key, uinfo);
        Log.info("redis center hmset " , key , ret);
    }

    static async get_uinfo_inredis(uid:number){
        let key = auth_center_key + uid;
        return await RedisAuth.engine().hgetall(key);
    }
}