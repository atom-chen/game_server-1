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

        this._redis_client.on("clientError", function (error: any) {
            Log.error("redis clientError!!!", error);
        })

        this._redis_client.on("close", function (error: any) {
            Log.error("redis close!!!", error);
        })

        this._redis_client.on("end", function (error: any) {
            Log.error("redis end!!!", error);
        })
    }

    //删除 成功返回1
    async delete(key:string){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.del);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, key);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //存字符串 成功返回 1
    async set(key:string|number, value:string|number){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.set);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, key , value);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //获取字符串 成功返回字符串
    async get(key:string|number){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.get);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, key);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //哈希存储一个完整table，成功返回'OK' ,data:table
    async hmset(table_name: string, data:any) {
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hmset);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, table_name, data);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //哈希存储，成功返回 1 , field:键 , value值
    //table如果不存在会创建
    async hset(table_name: string, field:string|number, value:string|number) {
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hset);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, table_name, field, value);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //获取哈希全部字段和值
    async hgetall(table_name:string){
        if(!this._redis_client){
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hgetall);
        if (async_func){
            try {
                let result = await async_func.call(this._redis_client, table_name);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //获取哈希表某个字段
    //存在返回值，不存在返回null
    async hget(table_name:string, field:string|number){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hget);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, table_name, field);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //删除哈希表某个字段，成功返回1， 否则返回0
    async hdelete(table_name:string, field:string|number){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hdel);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, table_name, field);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //查看table_name 中某个字段是否存在, 存在返回1，否则返回0
    async hexist(table_name:string, field:string|number){
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.hexists);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, table_name, field);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
    }

    //有序集合存储
    async zadd(add_key: string | number, count: number, mark: any) {
        if (!this._redis_client) {
            return;
        }
        const async_func: Function = util.promisify(this._redis_client.zadd);
        if (async_func) {
            try {
                let result = await async_func.call(this._redis_client, add_key, count, mark);
                return result;
            } catch (error) {
                Log.error(error);
            }
        }
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

