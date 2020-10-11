import RedisEngine from "../utils/RedisEngine";
import Log from "../utils/Log";

let game_info_key = "game_info_key_uid_";

export default class RedisGame {
    private static redisEngine: RedisEngine = new RedisEngine();

    static engine() {
        return RedisGame.redisEngine;
    }

    static connect(host?: string, port?: number, db_index?:number) {
        RedisGame.engine().connect(host, port, db_index);
    }

    //uinfo: table
    static async set_gameinfo_inredis(uid:number, uinfo:any) {
        let key = game_info_key + uid;
        Log.info("redis center hmset " , key);
        let ret = await RedisGame.engine().hmset(key, uinfo);
        let result_str = ret == "OK" ? "OK" : "fail"
        Log.info("redis center hmset ", key, result_str);
        return ret;
    }

    static async get_gameinfo_inredis(uid:number){
        let key = game_info_key + uid;
        return await RedisGame.engine().hgetall(key);
    }
}