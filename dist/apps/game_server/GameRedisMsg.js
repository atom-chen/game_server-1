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
var Log_1 = __importDefault(require("../../utils/Log"));
var PlayerManager_1 = __importDefault(require("./manager/PlayerManager"));
var RedisEvent_1 = __importDefault(require("../../database/RedisEvent"));
var GameServerData_1 = __importDefault(require("./GameServerData"));
var RoomManager_1 = __importDefault(require("./manager/RoomManager"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
var GameFunction_1 = __importDefault(require("./interface/GameFunction"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
/*
roomdata = {
    roomid:877207,
    uids:[1902,1903,1904],
    game_serverid:6090,
    gamerule: '{"playerCount":2,"playCount":3}', //string
}
*/
var GameRedisMsg = /** @class */ (function () {
    function GameRedisMsg() {
        var _a;
        this._redis_handler_map = {};
        this._redis_handler_map = (_a = {},
            _a[RedisEvent_1["default"].redis_lobby_msg_name.create_room] = this.on_redis_create_room,
            _a[RedisEvent_1["default"].redis_lobby_msg_name.back_room] = this.on_redis_back_room,
            _a[RedisEvent_1["default"].redis_lobby_msg_name.dessolve_room] = this.on_redis_dessolve_room,
            _a[RedisEvent_1["default"].redis_lobby_msg_name.exit_room] = this.on_redis_exit_room,
            _a[RedisEvent_1["default"].redis_lobby_msg_name.join_room] = this.on_redis_join_room,
            _a);
    }
    GameRedisMsg.getInstance = function () {
        return GameRedisMsg.Instance;
    };
    GameRedisMsg.prototype.recv_redis_msg = function (message) {
        try {
            var body = JSON.parse(message);
            Log_1["default"].info("hcc>>on_message,", body);
            if (body) {
                var xy_name = body.xy_name;
                var uid = body.uid;
                var server_key = body.game_serverid;
                if (xy_name && uid && server_key == GameServerData_1["default"].get_server_key()) {
                    if (this._redis_handler_map[xy_name]) {
                        this._redis_handler_map[xy_name].call(this, uid, body);
                    }
                }
            }
        }
        catch (error) {
            Log_1["default"].error("recv_redis_msg>>", error);
        }
    };
    GameRedisMsg.prototype.on_redis_create_room = function (uid, body) {
        Log_1["default"].info("hcc>>on_redis_create_room", body);
        var roomid = body.roomid;
        if (!roomid || roomid == "") {
            Log_1["default"].warn("on_redis_create_room failed!! roomid:", roomid, "roomdata:", body);
            return;
        }
        var room = roomMgr.get_room_by_roomid(roomid);
        if (room) {
            room.init_data(roomid, body);
        }
        else {
            room = roomMgr.alloc_room(roomid, body);
        }
    };
    GameRedisMsg.prototype.on_redis_back_room = function (uid, body) {
        Log_1["default"].info("hcc>>on_redis_back_room", body);
        var roomid = body.roomid;
        if (!roomid || roomid == "") {
            Log_1["default"].warn("on_redis_back_room failed!! roomid:", roomid, "roomdata:", body);
            return;
        }
        var room = roomMgr.get_room_by_roomid(roomid);
        if (room) {
            room.init_data(roomid, body);
        }
        else {
            room = roomMgr.alloc_room(roomid, body);
        }
    };
    GameRedisMsg.prototype.on_redis_dessolve_room = function (uid, body) {
        var uids = body.uids;
        for (var index = 0; index < uids.length; index++) {
            playerMgr.delete_player(uids[index]);
        }
        Log_1["default"].info("hcc>>on_redis_dessolve_room", body, ",playercoutn:", playerMgr.get_player_count());
        var roomid = body.roomid;
        roomMgr.delete_room(roomid);
    };
    GameRedisMsg.prototype.on_redis_exit_room = function (uid, body) {
        return __awaiter(this, void 0, void 0, function () {
            var roomid, uids, index, room, roominfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerMgr.delete_player(uid);
                        Log_1["default"].info("hcc>>on_redis_exit_room", body, " ,playercount:", playerMgr.get_player_count());
                        roomid = body.roomid;
                        uids = body.uids;
                        if (!roomid || roomid == "" || !uids) {
                            Log_1["default"].warn("on_redis_back_room failed!! roomid:", roomid, "roomdata:", body);
                            return [2 /*return*/];
                        }
                        index = uids.indexOf(uid);
                        if (index > 0) {
                            uids.splice(index, 1);
                        }
                        room = roomMgr.get_room_by_roomid(roomid);
                        if (room) {
                            room.init_data(roomid, body);
                        }
                        else {
                            room = roomMgr.alloc_room(roomid, body);
                        }
                        GameFunction_1["default"].broadcast_player_info_in_rooom(room, uid);
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_roomid(roomid)];
                    case 1:
                        roominfo = _a.sent();
                        if (!roominfo) { //房间已经解散
                            roomMgr.delete_room(roomid);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameRedisMsg.prototype.on_redis_join_room = function (uid, body) {
        Log_1["default"].info("hcc>>on_redis_join_room", body);
        var roomid = body.roomid;
        var room = roomMgr.get_room_by_roomid(roomid);
        if (room) {
            room.init_data(roomid, body);
        }
        else {
            room = roomMgr.alloc_room(roomid, body);
        }
    };
    GameRedisMsg.Instance = new GameRedisMsg();
    return GameRedisMsg;
}());
exports["default"] = GameRedisMsg;
//# sourceMappingURL=GameRedisMsg.js.map