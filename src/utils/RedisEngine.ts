import * as Redis from "redis";
import Log from "./Log";
import * as util from 'util';
import GameAppConfig from '../apps/config/GameAppConfig';

class RedisEngine {

    private _host: string = "";
    private _port: number = 0;
    private _db_index:number = 0;
    private _redis_client: any = null;

    constructor(){
    }

    get_engine():Redis.RedisClient{
        return this._redis_client;
    }

    connect(host?: string, port?: number, db_index?: number,){
        this._db_index = db_index || 0;
        this._host = host || GameAppConfig.getRealLocalIP();
        this._port = port || 6379;
        this._redis_client = Redis.createClient({
            host: this._host,
            port: this._port,
            db: this._db_index,
        });

        this._redis_client.on("error",function(error:any){
            Log.error(error);
        })
    }

    //哈希存储
    hmset(query_key:string, data:any){
        if (!this._redis_client) {
            return;
        }
        this._redis_client.hmset(query_key, data, function(error:any) {
            if(error){
                Log.error(error);
            }
        });
    }

    //获取哈希值
    async hgetall(query_key:string){
        if(!this._redis_client){
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hgetall);
        if (async_func){
            try {
                let result = await async_func.call(this._redis_client,query_key);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //有序集合存储
    zadd(add_key:string | number, count:number, mark:any){
        if (!this._redis_client) {
            return;
        }
        this._redis_client.zadd(add_key, count, mark,function(error:any){
            if(error){
                Log.error(error);
            }
        })
    }

    //有序集合:从大到小获取
    async zrevrange(query_key:string,from_num:number, to_num:number){
        const async_func: Function = util.promisify(this._redis_client.zrevrange);
        if (async_func){
            try {
                let result = await async_func.call(this._redis_client, query_key, from_num, to_num, "withscores");
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //有序集合:从小到大获取
    async zrange(query_key: string, from_num: number, to_num: number) {
        const async_func: Function = util.promisify(this._redis_client.zrange);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, query_key, from_num, to_num, "withscores");
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }
}

export default RedisEngine;

