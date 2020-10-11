"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Redis = __importStar(require("redis"));
var Platform_1 = __importDefault(require("../utils/Platform"));
var Log_1 = __importDefault(require("../utils/Log"));
var RedisEngine_1 = __importDefault(require("../utils/RedisEngine"));
var option = {
    host: Platform_1["default"].getLocalIP(),
    port: 6379,
    db_index: 0
};
var RedisClient = Redis.createClient();
RedisClient.on("error", function (error) {
    Log_1["default"].error(error);
});
////////////////////////////////////////
//string
////////////////////////////////////////
RedisClient.set("hcc_test_1", "123456");
RedisClient.get("hcc_test_1", function (err, data) {
    if (err) {
        Log_1["default"].error(err);
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
var engine = new RedisEngine_1["default"]();
engine.connect();
function testFunc() {
    return __awaiter(this, void 0, void 0, function () {
        var hkey2, ret_hash, ret_hase2, ret_hase3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hkey2 = "hash_test_for_2";
                    return [4 /*yield*/, engine.hset(hkey2, "hcc_key", "hcc_value")];
                case 1:
                    ret_hash = _a.sent();
                    Log_1["default"].info("ret_hase:", ret_hash);
                    return [4 /*yield*/, engine.hgetall(hkey2)];
                case 2:
                    ret_hase2 = _a.sent();
                    Log_1["default"].info("ret_hase2", ret_hase2);
                    return [4 /*yield*/, engine.hget(hkey2, "hcc_key")];
                case 3:
                    ret_hase3 = _a.sent();
                    Log_1["default"].info("ret_hase3", ret_hase3);
                    return [2 /*return*/];
            }
        });
    });
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
//# sourceMappingURL=RedisTest.js.map