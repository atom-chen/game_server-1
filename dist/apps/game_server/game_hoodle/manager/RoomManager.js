"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Room_1 = __importDefault(require("../cell/Room"));
var ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
var StringUtil_1 = __importDefault(require("../../../../utils/StringUtil"));
var Log_1 = __importDefault(require("../../../../utils/Log"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var GameHoodleProto_1 = require("../../../protocol/GameHoodleProto");
var Response_1 = __importDefault(require("../../../protocol/Response"));
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
                    room.broadcast_in_room(GameHoodleProto_1.Cmd.eDessolveRes, { status: Response_1["default"].OK });
                    room.kick_all_player();
                    _this.delete_room(room.get_room_id());
                }
            }
        }, 1000);
    }
    RoomManager.getInstance = function () {
        return RoomManager.Instance;
    };
    RoomManager.prototype.generate_roomid = function () {
        var roomid = StringUtil_1["default"].random_int_str(6);
        if (!this._room_set[roomid]) {
            return roomid;
        }
        else {
            return this.generate_roomid();
        }
    };
    RoomManager.prototype.alloc_room = function () {
        var roomid = this.generate_roomid();
        if (this._room_set[roomid]) {
            Log_1["default"].warn("alloc_room: room is exist!!!!");
            return this._room_set[roomid];
        }
        var room = new Room_1["default"](roomid);
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
    //uid 获取room, 用来判断玩家是否在房间里，或者已经创建了一个房间
    RoomManager.prototype.get_room_by_uid = function (uid) {
        for (var key in this._room_set) {
            var room = this._room_set[key];
            if (room.is_player_in_room(uid)) {
                return room;
            }
        }
        return null;
    };
    RoomManager.prototype.get_all_room = function () {
        return this._room_set;
    };
    RoomManager.Instance = new RoomManager();
    return RoomManager;
}());
exports["default"] = RoomManager;
//# sourceMappingURL=RoomManager.js.map