"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../../../utils/Log"));
var State_1 = require("../config/State");
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
/*
roomdata = {
    roomid:877207,
    uids:[1902,1903,1904],
    game_serverid:6090,
    gamerule: '{"playerCount":2,"playCount":3}', //string
}
*/
var Room = /** @class */ (function () {
    function Room(roomid, roomdata) {
        this._roomid = ""; //房间ID
        this._gamerule = ""; //规则json字符串
        this._player_uid_set = []; //玩家uid
        this._host_player_uid = -1; //房主uid
        this._is_match_room = false; //是否匹配房间，默认false
        this._match_roomlevel = 1; //匹配房间等级
        ///////
        this._game_state = State_1.GameState.InView; //游戏状态
        this._max_playe_count = -1; //最大局数
        this._cur_play_count = 0; //当前局数
        this._max_player_count = -1; //最大玩家数
        //////
        this._tick_count = 0; //包厢最长解散时间
        this.init_data(roomid, roomdata);
    }
    Room.prototype.init_data = function (roomid, roomdata) {
        if (!roomid || !roomdata) {
            return;
        }
        this._roomid = roomid;
        this._player_uid_set = roomdata.uids;
        this.set_game_rule(roomdata.gamerule);
    };
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
        this._max_player_count = gameruleObj.playerCount;
        this._max_playe_count = gameruleObj.playCount;
    };
    Room.prototype.get_game_rule = function () {
        return this._gamerule;
    };
    Room.prototype.get_all_player = function () {
        var player_set = {};
        var uids = this._player_uid_set;
        uids.forEach(function (uid) {
            var player = PlayerManager_1["default"].getInstance().get_player(uid);
            if (player) {
                player_set[uid] = player;
            }
        });
        return player_set;
    };
    //生成一个seatid,从1->maxplayercount
    /*
    born_seatid() {
        let exist_seatid = [];
        let all_seatid = [];
        let all_player = this.get_all_player();

        for (let seatid = 1; seatid <= this._max_player_count; seatid++) {
            all_seatid[seatid] = seatid;
        }

        for (let uid in all_player) {
            let player: Player = all_player[uid];
            let seatid = player.get_seat_id();
            if (seatid != -1) {
                exist_seatid.push(seatid);
            }
        }

        for (let i = 0; i <= exist_seatid.length; i++) {
            let seatid = exist_seatid[i];
            for (let j = 1; j <= this._max_player_count; j++) {
                if (seatid == all_seatid[j]) {
                    all_seatid.splice(j, 1);
                }
            }
        }

        if (all_seatid.length > 0) {
            for (let i = 1; i <= all_seatid.length; i++) {
                let seatid = all_seatid[i];
                if (seatid && seatid != -1) {
                    return seatid;
                }
            }
        }
        return -1;
    }
    */
    //当前房间内人数
    Room.prototype.get_cur_player_count = function () {
        return this._player_uid_set.length;
    };
    //房间在线人数
    Room.prototype.get_online_max_player_count = function () {
    };
    //房间配置的最多人数
    Room.prototype.get_max_player_count = function () {
        return this._max_player_count;
    };
    //配置的最多局数
    Room.prototype.get_max_play_count = function () {
        return this._max_playe_count;
    };
    //当前局数
    Room.prototype.set_cur_play_count = function (count) {
        this._cur_play_count = count;
    };
    //当前局数
    Room.prototype.get_cur_play_count = function () {
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
    };
    Room.prototype.broadcast_in_room = function (ctype, body, not_to_uid) {
        if (!ctype) {
            return;
        }
        var all_player = this.get_all_player();
        if (not_to_uid) {
            for (var key in all_player) {
                var player = all_player[key];
                if (player) {
                    if (player.get_uid() != not_to_uid) {
                        player.send_cmd(ctype, body);
                    }
                }
            }
        }
        else {
            for (var key in all_player) {
                var player = all_player[key];
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