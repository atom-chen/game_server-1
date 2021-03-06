"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../../../utils/Log"));
var State_1 = require("../config/State");
var Room = /** @class */ (function () {
    function Room(roomid) {
        this._roomid = ""; //房间ID
        this._gamerule = ""; //规则json字符串
        this._player_set = {}; //玩家信息，uid->player
        this._host_player_uid = -1; //房主uid
        this._is_match_room = false; //是否匹配房间，默认false
        this._match_roomlevel = 1; //匹配房间等级
        ///////
        this._game_state = State_1.GameState.InView; //游戏状态
        this._play_count = -1; //总的配置局数
        this._player_count = -1; //总的配置玩家数量
        this._cur_play_count = 0; //当前局数
        //////
        this._tick_count = 0; //包厢最长解散时间
        this._roomid = roomid;
    }
    Room.prototype.get_room_id = function () {
        return this._roomid;
    };
    Room.prototype.set_game_rule = function (gamerule) {
        this._gamerule = gamerule;
        var gameruleObj = {};
        try {
            gameruleObj = JSON.parse(gamerule);
        }
        catch (error) {
            Log_1["default"].error(error);
            return;
        }
        this._player_count = gameruleObj.playerCount;
        this._play_count = gameruleObj.playCount;
    };
    Room.prototype.get_game_rule = function () {
        return this._gamerule;
    };
    //玩家加入房间
    //is_back: 是否本来就在房间里面，只是返回
    Room.prototype.add_player = function (player, is_back) {
        if (is_back == null || is_back == false || is_back == undefined || !is_back) {
            //不是返回房间
            if (this._player_count <= 0 || this._player_count == null || this._player_count == undefined) {
                Log_1["default"].warn("add_player error, playercount is not exist!!");
                return false;
            }
            if (this.get_player_count() >= this._player_count) {
                Log_1["default"].warn("add_player error, playercount is full");
                return false;
            }
            var seatid = this.born_seatid();
            if (seatid == -1) {
                Log_1["default"].warn("add_player error,seatid is invalid");
                return false;
            }
            player.set_seat_id(seatid);
        }
        this._player_set[player.get_uid()] = player;
        Log_1["default"].info("add player , playercount: ", this.get_player_count());
        return true;
    };
    //生成一个seatid
    Room.prototype.born_seatid = function () {
        var exist_seatid = [];
        var all_seatid = [];
        for (var uid in this._player_set) {
            var player = this._player_set[uid];
            var seatid = player.get_seat_id();
            if (seatid != -1) {
                exist_seatid.push(seatid);
            }
        }
        for (var seatid = 1; seatid <= this._player_count; seatid++) {
            all_seatid[seatid] = seatid;
        }
        for (var i = 0; i <= exist_seatid.length; i++) {
            var seatid = exist_seatid[i];
            for (var j = 1; j <= this._player_count; j++) {
                if (seatid == all_seatid[j]) {
                    all_seatid.splice(j, 1);
                }
            }
        }
        if (all_seatid.length > 0) {
            for (var i = 1; i <= all_seatid.length; i++) {
                var seatid = all_seatid[i];
                if (seatid && seatid != -1) {
                    return seatid;
                }
            }
        }
        return -1;
    };
    Room.prototype.kick_player = function (uid) {
        if (this._player_set[uid]) {
            delete this._player_set[uid];
            Log_1["default"].info("room kick player by uid success , playercount: ", this.get_player_count());
            return true;
        }
        return false;
    };
    Room.prototype.kick_all_player = function () {
        var _this = this;
        var key_set = [];
        for (var key in this._player_set) {
            key_set.push(key);
        }
        key_set.forEach(function (value) {
            if (_this._player_set[value]) {
                _this._player_set[value].clear_room_info();
                delete _this._player_set[value];
            }
        });
        Log_1["default"].info("room kick all player, playercount: ", this.get_player_count());
    };
    Room.prototype.get_all_player = function () {
        return this._player_set;
    };
    Room.prototype.get_player = function (uid) {
        return this._player_set[uid];
    };
    Room.prototype.get_player_by_seatid = function (seatid) {
        for (var key in this._player_set) {
            var player = this._player_set[key];
            if (player) {
                if (player.get_seat_id() == seatid) {
                    return player;
                }
            }
        }
    };
    Room.prototype.is_player_in_room = function (uid) {
        if (this._player_set[uid]) {
            return true;
        }
        return false;
    };
    //当前房间内人数
    Room.prototype.get_player_count = function () {
        var count = 0;
        for (var key in this._player_set) {
            if (this._player_set[key]) {
                count++;
            }
        }
        return count;
    };
    //房间在线人数
    Room.prototype.get_online_player_count = function () {
        var online_player_count = 0;
        for (var key in this._player_set) {
            var player = this._player_set[key];
            if (player) {
                if (player.get_offline() == false) {
                    online_player_count++;
                }
            }
        }
        return online_player_count;
    };
    //房间配置的最多人数
    Room.prototype.get_conf_player_count = function () {
        return this._player_count;
    };
    //配置的最多局数
    Room.prototype.get_conf_play_count = function () {
        return this._play_count;
    };
    //当前局数
    Room.prototype.set_play_count = function (count) {
        this._cur_play_count = count;
    };
    //当前局数
    Room.prototype.get_play_count = function () {
        return this._cur_play_count;
    };
    Room.prototype.set_room_host_uid = function (uid) {
        this._host_player_uid = uid;
    };
    Room.prototype.get_room_host_uid = function () {
        return this._host_player_uid;
    };
    Room.prototype.is_room_host = function (uid) {
        return this._host_player_uid === uid;
    };
    Room.prototype.set_game_state = function (game_state) {
        this._game_state = game_state;
    };
    Room.prototype.get_game_state = function () {
        return this._game_state;
    };
    Room.prototype.set_is_match_room = function (is_match) {
        this._is_match_room = is_match;
    };
    Room.prototype.get_is_match_room = function () {
        return this._is_match_room;
    };
    Room.prototype.set_match_roomlevel = function (roomlevel) {
        this._match_roomlevel = roomlevel;
    };
    Room.prototype.get_match_roomlevel = function () {
        return this._match_roomlevel;
    };
    Room.prototype.set_tick_count = function (count) {
        this._tick_count = count;
    };
    Room.prototype.get_tick_count = function () {
        return this._tick_count;
    };
    Room.prototype.have_robot_player = function () {
        for (var idx in this._player_set) {
            var player = this._player_set[idx];
            if (player.is_robot()) {
                return true;
            }
        }
        return false;
    };
    Room.prototype.broadcast_in_room = function (ctype, body, not_to_player) {
        if (!ctype) {
            return;
        }
        if (not_to_player) {
            for (var key in this._player_set) {
                var player = this._player_set[key];
                if (player) {
                    if (player.get_uid() != not_to_player.get_uid()) {
                        player.send_cmd(ctype, body);
                    }
                }
            }
        }
        else {
            for (var key in this._player_set) {
                var player = this._player_set[key];
                if (player) {
                    player.send_cmd(ctype, body);
                }
            }
        }
    };
    return Room;
}());
exports["default"] = Room;
//# sourceMappingURL=Room.js.map