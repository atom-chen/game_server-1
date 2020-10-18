import * as Redis from "redis";
import Log from "./Log";
import * as util from 'util';
import GameAppConfig from '../apps/config/GameAppConfig';

class RedisEngine {

    private _host: string = "";
    private _port: number = 0;
    private _db_index:number = 0;
    private _redis_client:any = null;
    private _message_func:any = null;

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

        this._redis_client.on("subscribe", function (channel:string, count:number) {
            Log.info("redis subscribe:", channel, count);
        })

        let _this = this;
        this._redis_client.on("message", function (channel: string, message:string) {
            // Log.info("redis message:", channel, message);
            if (_this._message_func){
                _this._message_func(channel, message)
            }
        })
    }

    //订阅频道消息
    listen_channel(channelName:string, func:Function){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        this.get_engine().subscribe(channelName);
        this._message_func = func;
        Log.info("listen channel: " , channelName , "success!!");
    }

    //取消订阅消息
    unlisten_channel(channelName:string){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        this.get_engine().unsubscribe(channelName);
        Log.info("unsubscribe channel: ", channelName, "success!!");
    }

    //发布消息到频道
    publish_msg(channelName:string, msg:any){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        this.get_engine().publish(channelName, msg)
    }

    //删除 成功返回1
    async delete(key:string){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().del);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), key);
                return result;
            } catch (error) {
                Log.error("delete>>", error);
            }
        }
    }

    //存字符串 成功返回 1
    async set(key:string|number, value:string|number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().set);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), key , value);
                return result;
            } catch (error) {
                Log.error("set>>", error);
            }
        }
    }

    //获取字符串 成功返回字符串
    async get(key:string|number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().get);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), key);
                return result;
            } catch (error) {
                Log.error("get>>",error);
            }
        }
    }

    //哈希存储一个完整table，成功返回'OK' ,data:table
    async hmset(table_name: string, data:any) {
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hmset);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), table_name, data);
                return result;
            } catch (error) {
                Log.error("hmset>>",error);
            }
        }
    }

    //哈希存储，成功返回 1 , field:键 , value值
    //table如果不存在会创建
    async hset(table_name: string, field:string|number, value:string|number) {
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hset);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), table_name, field, value);
                return result;
            } catch (error) {
                Log.error("hset>>",error);
            }
        }
    }

    //获取哈希全部字段和值
    async hgetall(table_name:string){
        if(!this.get_engine()){
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hgetall);
        if (async_func){
            try {
                let result = await async_func.call(this.get_engine(), table_name);
                return result;
            } catch (error) {
                Log.error("hgetall>>",error);
            }
        }
    }

    //获取哈希表某个字段
    //存在返回值，不存在返回null
    async hget(table_name:string, field:string|number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hget);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), table_name, field);
                return result;
            } catch (error) {
                Log.error("hget>>",error);
            }
        }
    }

    //删除哈希表某个字段，成功返回1， 否则返回0
    async hdelete(table_name:string, field:string|number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hdel);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), table_name, field);
                return result;
            } catch (error) {
                Log.error("hdelete>>",error);
            }
        }
    }

    //查看table_name 中某个字段是否存在, 存在返回1，否则返回0
    async hexist(table_name:string, field:string|number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().hexists);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), table_name, field);
                return result;
            } catch (error) {
                Log.error("hexist>>",error);
            }
        }
    }

    //有序集合存储
    async zadd(add_key: string | number, count: number, mark: any) {
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().zadd);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), add_key, count, mark);
                return result;
            } catch (error) {
                Log.error("zadd>>",error);
            }
        }
    }

    //有序集合:从大到小获取
    async zrevrange(query_key:string,from_num:number, to_num:number){
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().zrevrange);
        if (async_func){
            try {
                let result = await async_func.call(this.get_engine(), query_key, from_num, to_num, "withscores");
                return result;
            } catch (error) {
                Log.error("zrevrange>>",error);
            }
        }
    }

    //有序集合:从小到大获取
    async zrange(query_key: string, from_num: number, to_num: number) {
        if (!this.get_engine()) {
            Log.error("redis client is null!")
            return;
        }
        const async_func: Function = util.promisify(this.get_engine().zrange);
        if (async_func) {
            try {
                let result = await async_func.call(this.get_engine(), query_key, from_num, to_num, "withscores");
                return result;
            } catch (error) {
                Log.error("zrange>>",error);
            }
        }
    }

}

export default RedisEngine;

