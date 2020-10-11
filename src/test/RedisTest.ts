import * as Redis from "redis";
import Platform from "../utils/Platform";
import Log from '../utils/Log';
import RedisEngine from '../utils/RedisEngine';
import RedisAuthCenter from '../database/RedisAuth';

let option = {
    host: Platform.getLocalIP(),
    port: 6379,
    db_index: 0,
}


let RedisClient = Redis.createClient();
RedisClient.on("error",function(error:any) {
    Log.error(error);
})

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
/*
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
///*
let engine: RedisEngine =  new RedisEngine()
engine.connect();

async function testFunc() {
    /*
    let ret_set = await engine.set("hcc_set", 123);
    Log.info("ret_set:", ret_set);
    let ret = await engine.get("hcc_set")
    Log.info("ret:", ret);

    let ret_del = await engine.delete("hcc_set");
    Log.info("ret_del: " , ret_del);

    let ret_after_del = await engine.get("hcc_set")
    Log.info("ret_after_del:", ret_after_del);
    */
    /*
    let table = {
        AAA: 1,
        BBB: 2,
        CCC: "234",
        hcc: "787",
    }
    let hkey = "hash_for_test"
    
    let ret_hash = await engine.hmset(hkey, table);
    Log.info("ret_hase:" , ret_hash);
    
    let ret_hase2 = await engine.hgetall(hkey);
    Log.info("ret_hase2", ret_hase2);

    let ret_hase3 = await engine.hget(hkey, "AAA");
    let ret_hase4 = await engine.hget(hkey, "bbb");
    Log.info("ret_hase3", ret_hase3, ret_hase4);

    let ret_del = await engine.hdelete(hkey, "AAA");
    Log.info("ret_del", ret_del);

    let ret_hase5 = await engine.hgetall(hkey);
    Log.info("ret_hase4", ret_hase5);

    let exist1 = await engine.hexist(hkey, "AAA");
    let exist2 = await engine.hexist(hkey, "BBB");
    Log.info("exist1", exist1, exist2);
    */

    let hkey2 = "hash_test_for_2"
    let ret_hash = await engine.hset(hkey2, "hcc_key"  ,"hcc_value");
    Log.info("ret_hase:", ret_hash);

    let ret_hase2 = await engine.hgetall(hkey2);
    Log.info("ret_hase2", ret_hase2);

    let ret_hase3 = await engine.hget(hkey2, "hcc_key");
    Log.info("ret_hase3", ret_hase3);
}

testFunc();

//*/
/*
RedisAuthCenter.connect();
let uid = 1
let uinfo = {
    name:"hcc",
    age:25,
    sex:"boy",
}
RedisAuthCenter.set_uinfo_inredis(uid,uinfo);
async function get_uinfo(){
    let get_info = await RedisAuthCenter.get_uinfo_inredis(uid);
    Log.info("get_info:" , get_info);
}

get_uinfo();
*/