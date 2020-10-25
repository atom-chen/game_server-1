"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Room_1 = __importDefault(require("../objects/Room"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var RedisLobby_1 = __importDefault(require("../../../database/RedisLobby"));
var RoomManager = /** @class */ (function () {
    function RoomManager() {
        this._room_set = {}; //roomid-->room
        //删除创建超过10分钟的房间
        var _this = this;
        setInterval(function () {
            for (var idx in _this._room_set) {
                var room = _this._room_set[idx];
                room.set_tick_count(room.get_tick_count() + 1);
                var tick_count = room.get_tick_count();
                // Log.info("tick count: roomid: " , room.get_room_id() , " count: ", tick_count);
                if (tick_count >= GameHoodleConfig_1["default"].ROOM_MAX_DISMISS_TIME) {
                    _this.delete_room(room.get_room_id());
                }
            }
        }, 1000);
    }
    RoomManager.getInstance = function () {
        return RoomManager.Instance;
    };
    RoomManager.prototype.alloc_room = function (roomid, roomdata) {
        var room = new Room_1["default"](roomid, roomdata);
        this._room_set[roomid] = room;
        Log_1["default"].info("creat room success roomid: ", roomid, " ,roomCount: ", this.get_room_count());
        return room;
    };
    //用roomid获取房间
    RoomManager.prototype.get_room_by_roomid = function (roomid) {
        if (this._room_set[roomid]) {
            return this._room_set[roomid];
        }
        return null;
    };
    RoomManager.prototype.delete_room = function (roomid) {
        if (this._room_set[roomid]) {
            delete this._room_set[roomid];
            Log_1["default"].info("delete_room:", roomid, "success, roomCount: ", this.get_room_count());
            RedisLobby_1["default"].delete_room(roomid);
            return true;
        }
        else {
            Log_1["default"].warn("delete_room:", roomid, "is not in game server!!!!");
            return false;
        }
    };
    RoomManager.prototype.get_room_count = function () {
        return ArrayUtil_1["default"].GetArrayLen(this._room_set);
    };
    RoomManager.prototype.get_all_room = function () {
        return this._room_set;
    };
    RoomManager.Instance = new RoomManager();
    return RoomManager;
}());
exports["default"] = RoomManager;
//# sourceMappingURL=RoomManager.js.map