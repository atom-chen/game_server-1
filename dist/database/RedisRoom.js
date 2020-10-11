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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RedisEngine_1 = __importDefault(require("../utils/RedisEngine"));
var StringUtil_1 = __importDefault(require("../utils/StringUtil"));
var uid_roomid_table_key = "uid_roomid_table_key";
var room_id_length = 6;
//存储方式:
/*
table: uid_roomid_table_key
{
    uid: roomid,
    uid: roomid,
    ...
}

*/
var RedisRoom = /** @class */ (function () {
    function RedisRoom() {
    }
    RedisRoom.engine = function () {
        return RedisRoom.redisEngine;
    };
    RedisRoom.connect = function (host, port, db_index) {
        RedisRoom.engine().connect(host, port, db_index);
    };
    //保存 uid-roomid 映射
    //成功返回'OK'
    RedisRoom.save_uid_roomid_inredis = function (uid, roomid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisRoom.engine().hset(uid_roomid_table_key, uid, roomid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //玩家是否在房间内
    //返回boolean
    RedisRoom.uid_is_exist_in_room = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisRoom.engine().hexist(uid_roomid_table_key, uid)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret == 1];
                }
            });
        });
    };
    //根据 uid 获取roomid
    RedisRoom.get_roomid_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisRoom.engine().hget(uid_roomid_table_key, uid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //删除玩家uid和room的映射
    //uid删除了，roomid 可能有其他玩家有存在关系
    RedisRoom.delete_uid_in_room = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisRoom.engine().hdelete(uid_roomid_table_key, uid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //获取所有uid，roomid映射
    RedisRoom.get_all_uid_room = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisRoom.engine().hgetall(uid_roomid_table_key)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //生成一个6位roomid
    RedisRoom.generate_roomid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var new_roomid, allroom, key, roomid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        new_roomid = StringUtil_1["default"].random_int_str(room_id_length);
                        return [4 /*yield*/, RedisRoom.get_all_uid_room()];
                    case 1:
                        allroom = _a.sent();
                        for (key in allroom) {
                            roomid = allroom[key];
                            if (roomid == new_roomid) {
                                RedisRoom.generate_roomid();
                            }
                        }
                        return [2 /*return*/, new_roomid];
                }
            });
        });
    };
    RedisRoom.redisEngine = new RedisEngine_1["default"]();
    return RedisRoom;
}());
exports["default"] = RedisRoom;
//# sourceMappingURL=RedisRoom.js.map