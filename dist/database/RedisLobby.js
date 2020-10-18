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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var RedisEngine_1 = __importDefault(require("../utils/RedisEngine"));
var StringUtil_1 = __importDefault(require("../utils/StringUtil"));
var Log_1 = __importDefault(require("../utils/Log"));
var util = __importStar(require("util"));
var ROOMID_ROOMINFO_KEY = "hash_roomid_roominfo_key";
var UID_ROOMINFO_KEY = "hash_uid_roominfo_key";
var room_id_length = 6;
var game_serverindex_playercount_key = "game_serverindex_playercount_key";
var MAX_GAME_SERVER_PLAYER_COUNT = 1000; //
/*
1. 这两个地方同时保存了roominfo_json
2. 修改的话，这两个地方同时需要修改

//////////////////////
//1. roomid->roominfo_json 映射存储方式:
//////////////////////
ROOMID_ROOMINFO_KEY =
{
    roomid_111111: {
        roomid:roomid,
        uids:[111111,222222,333333,444444],
        gamerule:"str...",
        game_server_id:1,
        ex_info:"xx",
    },
    roomid_222222: {
        ...
    },
}

///////////////////////
//2. uid->roominfo_json 映射存储方式：
///////////////////////
UID_ROOMINFO_KEY =
{
    uid_1001934: {
        roomid:roomid,
        uids:[111111,222222,333333,444444],
        gamerule:"str...",
        game_server_id:1,
        ex_info:"xx",
    },
    uid_1001935: {
        ...
    },
}
*/
var RedisLobby = /** @class */ (function () {
    function RedisLobby() {
    }
    RedisLobby.engine = function () {
        return RedisLobby.redisEngine;
    };
    RedisLobby.connect = function (host, port, db_index) {
        RedisLobby.engine().connect(host, port, db_index);
    };
    RedisLobby.get_roomid_key = function (roomid) {
        var roomid_key = "roomid_roominfo_" + roomid;
        return roomid_key;
    };
    RedisLobby.get_uid_key = function (uid) {
        var uid_key = "uid_roominfo_" + uid;
        return uid_key;
    };
    //保存 roomid->roominfo_json 映射
    //返回 boolean
    RedisLobby.save_roomid_roominfo_inredis = function (roomid, roominfo_json) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomid_key = RedisLobby.get_roomid_key(roomid);
                        return [4 /*yield*/, RedisLobby.engine().hset(ROOMID_ROOMINFO_KEY, roomid_key, roominfo_json)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret == 1];
                }
            });
        });
    };
    //根据 roomid 获取roominfo_json
    RedisLobby.get_roominfo_by_roomid = function (roomid) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomid_key = RedisLobby.get_roomid_key(roomid);
                        return [4 /*yield*/, RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    //保存 uid->roominfo_json 映射
    //返回 boolean
    RedisLobby.save_uid_roominfo_inredis = function (uid, roominfo_json) {
        return __awaiter(this, void 0, void 0, function () {
            var uid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid_key = RedisLobby.get_uid_key(uid);
                        return [4 /*yield*/, RedisLobby.engine().hset(UID_ROOMINFO_KEY, uid_key, roominfo_json)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret == 1];
                }
            });
        });
    };
    //根据 uid 获取roominfo_json
    RedisLobby.get_roominfo_by_uid = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var uid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid_key = RedisLobby.get_uid_key(uid);
                        return [4 /*yield*/, RedisLobby.engine().hget(UID_ROOMINFO_KEY, uid_key)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    //玩家是否在房间内
    //返回 boolean
    RedisLobby.uid_is_exist_in_room = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var uid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid_key = RedisLobby.get_uid_key(uid);
                        return [4 /*yield*/, RedisLobby.engine().hget(UID_ROOMINFO_KEY, uid_key)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, !util.isNullOrUndefined(ret)];
                }
            });
        });
    };
    //增加roominfo_json内玩家
    //同时更新
    RedisLobby.add_uid_in_roominfo = function (roomid, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid_key, ret, roominfo_obj, uids, index, roominfo_json_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomid_key = RedisLobby.get_roomid_key(roomid);
                        return [4 /*yield*/, RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key)];
                    case 1:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 3];
                        roominfo_obj = JSON.parse(ret);
                        uids = roominfo_obj.uids;
                        if (!uids) return [3 /*break*/, 3];
                        index = uids.indexOf(uid);
                        if (!(index < 0)) return [3 /*break*/, 3];
                        uids.push(uid);
                        roominfo_obj.uids = uids;
                        roominfo_json_1 = JSON.stringify(roominfo_obj);
                        return [4 /*yield*/, RedisLobby.save_roomid_roominfo_inredis(roomid, roominfo_json_1)];
                    case 2:
                        _a.sent();
                        //
                        uids.forEach(function (uid) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, RedisLobby.save_uid_roominfo_inredis(uid, roominfo_json_1)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    //删除玩家uid和获取roominfo_json的映射
    //返回boolean
    //内部使用
    RedisLobby.delete_uid_to_roominfo = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var uid_key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uid_key = RedisLobby.get_uid_key(uid);
                        return [4 /*yield*/, RedisLobby.engine().hdelete(UID_ROOMINFO_KEY, uid_key)];
                    case 1:
                        ret = _a.sent();
                        return [2 /*return*/, ret == 1];
                }
            });
        });
    };
    //删除roominfo_json内玩家uid
    //同时更新 roominfo_json
    RedisLobby.delete_uid_in_roominfo = function (roomid, uid) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid_key, ret, roominfo_obj, uids, index, roominfo_json_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomid_key = RedisLobby.get_roomid_key(roomid);
                        return [4 /*yield*/, RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key)];
                    case 1:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 7];
                        roominfo_obj = JSON.parse(ret);
                        uids = roominfo_obj.uids;
                        if (!uids) return [3 /*break*/, 7];
                        index = uids.indexOf(uid);
                        if (!(index > -1)) return [3 /*break*/, 5];
                        uids.splice(index, 1);
                        roominfo_obj.uids = uids;
                        if (!(uids.length <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, RedisLobby.delete_room(roomid)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        roominfo_json_2 = JSON.stringify(roominfo_obj);
                        return [4 /*yield*/, RedisLobby.save_roomid_roominfo_inredis(roomid, roominfo_json_2)];
                    case 4:
                        _a.sent();
                        //
                        uids.forEach(function (uid) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, RedisLobby.save_uid_roominfo_inredis(uid, roominfo_json_2)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        _a.label = 5;
                    case 5: 
                    //再删除uid->roominfo_json 映射
                    return [4 /*yield*/, RedisLobby.delete_uid_to_roominfo(uid)];
                    case 6:
                        //再删除uid->roominfo_json 映射
                        _a.sent();
                        return [2 /*return*/, true];
                    case 7: return [2 /*return*/, false];
                }
            });
        });
    };
    //删除房间
    RedisLobby.delete_room = function (roomid) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid_key, ret, roominfo_obj, uids, ret2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roomid_key = RedisLobby.get_roomid_key(roomid);
                        return [4 /*yield*/, RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key)];
                    case 1:
                        ret = _a.sent();
                        if (ret) {
                            roominfo_obj = JSON.parse(ret);
                            uids = roominfo_obj.uids;
                            uids.forEach(function (uid) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, RedisLobby.delete_uid_to_roominfo(uid)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        return [4 /*yield*/, RedisLobby.engine().hdelete(ROOMID_ROOMINFO_KEY, roomid_key)];
                    case 2:
                        ret2 = _a.sent();
                        if (ret2 == 1) {
                            return [2 /*return*/, true];
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    //获取所有roomid->roominfo_json映射
    RedisLobby.get_all_roominfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisLobby.engine().hgetall(ROOMID_ROOMINFO_KEY)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    //生成一个6位roomid, 如果有相同的会失败，需要再次生成
    RedisLobby.generate_roomid = function () {
        return __awaiter(this, void 0, void 0, function () {
            var new_roomid, allroom, key, room_info_json, roominfo_obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        new_roomid = StringUtil_1["default"].random_int_str(room_id_length);
                        return [4 /*yield*/, RedisLobby.get_all_roominfo()];
                    case 1:
                        allroom = _a.sent();
                        for (key in allroom) {
                            room_info_json = allroom[key];
                            roominfo_obj = null;
                            try {
                                roominfo_obj = JSON.parse(room_info_json);
                            }
                            catch (error) {
                                Log_1["default"].info(error);
                            }
                            if (roominfo_obj == null) {
                                continue;
                            }
                            if (String(roominfo_obj.roomid) == new_roomid) {
                                return [2 /*return*/, null];
                            }
                        }
                        return [2 /*return*/, new_roomid];
                }
            });
        });
    };
    //////////////////////////////////////
    //保存服务id, 人数
    RedisLobby.set_server_playercount = function (server_index, playercount) {
        return __awaiter(this, void 0, void 0, function () {
            var key, ret, result_str;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = game_serverindex_playercount_key;
                        return [4 /*yield*/, RedisLobby.engine().hset(key, server_index, playercount)];
                    case 1:
                        ret = _a.sent();
                        result_str = ret == 1;
                        Log_1["default"].info("hcc>>redis set_server_playercount ", key, result_str);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    //获取服务人数信息
    RedisLobby.get_server_playercount_info = function () {
        return __awaiter(this, void 0, void 0, function () {
            var key, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = game_serverindex_playercount_key;
                        return [4 /*yield*/, RedisLobby.engine().hgetall(key)];
                    case 1:
                        ret = _a.sent();
                        Log_1["default"].info("hcc>>redis get_server_playercount_info ", key, ret);
                        return [2 /*return*/, ret];
                }
            });
        });
    };
    RedisLobby.is_server_exist = function (server_key) {
        return __awaiter(this, void 0, void 0, function () {
            var gameinfo, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisLobby.get_server_playercount_info()];
                    case 1:
                        gameinfo = _a.sent();
                        if (gameinfo) {
                            for (key in gameinfo) {
                                if (key == server_key) {
                                    return [2 /*return*/, true];
                                }
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    //根据服务的负载，进行选择哪个game_server
    RedisLobby.choose_game_server = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameinfo, key, gameserver_key, playercount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisLobby.get_server_playercount_info()];
                    case 1:
                        gameinfo = _a.sent();
                        if (gameinfo) {
                            for (key in gameinfo) {
                                gameserver_key = Number(key);
                                playercount = Number(gameinfo[key]);
                                if (playercount <= MAX_GAME_SERVER_PLAYER_COUNT) {
                                    return [2 /*return*/, gameserver_key];
                                }
                            }
                        }
                        return [2 /*return*/, -1];
                }
            });
        });
    };
    RedisLobby.redisEngine = new RedisEngine_1["default"]();
    return RedisLobby;
}());
exports["default"] = RedisLobby;
//# sourceMappingURL=RedisLobby.js.map