import * as Redis from "redis";
import Platform from "../utils/Platform";
import Log from '../utils/Log';
import RedisEngine from '../utils/RedisEngine';

let option = {
    host: Platform.getLocalIP(),
    port: 6379,
    db_index: 0,
}


let RedisClient = Redis.createClient();
RedisClient.on("error",function(error:any) {
    Log.error(error);
})
/*

////////////////////////////////////////
//string
////////////////////////////////////////
RedisClient.set("hcc_test_1","123456");
RedisClient.get("hcc_test_1",function (err:any, data:any) {
    if(err){
        Log.error(err);
        return;
    }
    // Log.info("hcc>recv: " , data);
});

////////////////////////////////////////
//hash table
////////////////////////////////////////
let table = {
    name:"hcc",
    age:"20",
    sex:"boy",
}
RedisClient.hmset("hcc_hm_set_1", table,function(err, data) {
    if(err){
        Log.error(err);
        return
    }
    Log.info("hmset success", data);
});

RedisClient.hmget("hcc_hm_set_1", "name",function(err,data) {
    if (err) {
        Log.error(err);
        return
    }
    Log.info("hmget success", data);
});

////////////////////////////////////////
//list
////////////////////////////////////////
RedisClient.lpush("hcc_list_1", "hcc")
RedisClient.lpush("hcc_list_1", "shucheng")
RedisClient.rpush("hcc_list_1", "shucheng_r")

RedisClient.lrange("hcc_list_1",0,10,function(err,data) {
    if (err) {
        Log.error(err);
        return
    }
    Log.info("lrange success", data);
});


////////////////////////////////////////
//set
////////////////////////////////////////
RedisClient.zadd("hcc_set_1", 500, "aaa");
RedisClient.zadd("hcc_set_1", 300, "bbb");
RedisClient.zadd("hcc_set_1", 600, "ccc");

RedisClient.zrange("hcc_set_1", 0, 10, function (err, data) {
    if (err) {
        Log.error(err);
        return
    }
    Log.info("zrange success", data);
});
*/

////////////////////////////////////////
//
////////////////////////////////////////

let engine: RedisEngine =  new RedisEngine()
engine.connect();

engine.zadd("hcc_set_2", 100, "aaa")
engine.zadd("hcc_set_2", 200, "bbb")
engine.zadd("hcc_set_2", 50, "ccc")
engine.zadd("hcc_set_2", 900, "ddd")

async function testFunc() {
    let ret = await engine.zrange("hcc_set_2",0 , 100)
    Log.info(ret);
}

testFunc();


let table = {
    name: "hcc",
    age: "20",
    sex: "boy",
}

engine.hmset("hcc_hmset_1",table);
async function hgettestFunc() {
    let ret = await engine.hgetall("hcc_hmset_1");
    Log.info(ret);
}

hgettestFunc()

