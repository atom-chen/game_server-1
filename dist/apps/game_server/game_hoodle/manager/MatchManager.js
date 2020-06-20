"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
var Log_1 = __importDefault(require("../../../../utils/Log"));
var State_1 = require("../config/State");
var RoomManager_1 = __importDefault(require("./RoomManager"));
var GameHoodleProto_1 = require("../../../protocol/GameHoodleProto");
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var Response_1 = __importDefault(require("../../../protocol/Response"));
var GameFunction_1 = __importDefault(require("../interface/GameFunction"));
var RoomListConfig_1 = require("../config/RoomListConfig");
var roomMgr = RoomManager_1["default"].getInstance();
var MatchManager = /** @class */ (function () {
    /*
        _zoom_list:{
            [1]:{ //roomlevel
                match_list:{}
                in_match_list:{}
            }，

             [2]:{
                match_list:{}
                in_match_list:{}
            }，

             [3]:{
                match_list:{}
                in_match_list:{}
            }，
        }

    */
    function MatchManager() {
        this._zoom_list = {}; //区间列表
        for (var key in RoomListConfig_1.RoomListConfig) {
            var conf = RoomListConfig_1.RoomListConfig[key];
            this._zoom_list[conf.roomlevel] = {};
            this._zoom_list[conf.roomlevel]["match_list"] = {};
            this._zoom_list[conf.roomlevel]["in_match_list"] = {};
        }
    }
    MatchManager.getInstance = function () {
        return MatchManager.Instance;
    };
    //开始匹配
    MatchManager.prototype.start_match = function () {
        // 匹配逻辑
        var _this = this;
        //先找没满人的房间，再找匹配列表中的人
        var is_match_room_success = false;
        setInterval(function () {
            is_match_room_success = false;
            for (var roomlevel in _this._zoom_list) {
                var zoom = _this._zoom_list[roomlevel];
                var tmproomlevel = Number(roomlevel);
                var not_full_room = _this.get_not_full_room(tmproomlevel);
                if (not_full_room) {
                    // Log.info("not_full_room111, roomid:", not_full_room.get_room_id());
                    var player = _this.get_matching_player(zoom);
                    if (!player) {
                        player = _this.get_in_matching_player(zoom);
                    }
                    if (player) {
                        if (roomMgr.get_room_by_uid(player.get_uid())) {
                            continue;
                        }
                        if (player.is_robot() && not_full_room.have_robot_player()) {
                            continue;
                        }
                        // Log.info("not_full_room222, player: " , player.get_unick());
                        var is_success = not_full_room.add_player(player);
                        if (is_success) {
                            // Log.info("not_full_room333, player: ", player.get_unick());
                            _this.send_match_player(not_full_room.get_all_player());
                            player.set_offline(false);
                            _this.set_room_host(not_full_room);
                            var body = {
                                status: Response_1["default"].OK,
                                matchsuccess: true
                            };
                            player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, body);
                            GameFunction_1["default"].broadcast_player_info_in_rooom(not_full_room, player);
                            _this.del_player_from_match_list_by_uid(player.get_uid(), zoom.match_list); //从待匹配列表删除
                            _this.del_player_from_in_match_list_by_uid(player.get_uid(), zoom.in_match_list); //匹配完成的列表删除
                            is_match_room_success = true;
                        }
                    }
                }
            }
            if (is_match_room_success == false) {
                _this.do_match_player();
            }
            _this.log_match_list();
        }, GameHoodleConfig_1["default"].MATCH_INTERVAL);
    };
    MatchManager.prototype.do_match_player = function () {
        // Log.info("do_match_player111");
        for (var roomlevel in this._zoom_list) {
            var zoom = this._zoom_list[roomlevel];
            var player = this.get_matching_player(zoom);
            if (player) {
                if (roomMgr.get_room_by_uid(player.get_uid())) {
                    continue;
                }
                // Log.info("do_match_player222");
                var match_count = ArrayUtil_1["default"].GetArrayLen(zoom.in_match_list);
                if (match_count < GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
                    var ret = this.add_player_to_in_match_list(player, zoom); //加入正式匹配列表
                    if (ret) {
                        var match_count_1 = ArrayUtil_1["default"].GetArrayLen(zoom.in_match_list);
                        if (match_count_1 > 1) {
                            this.send_match_player(zoom.in_match_list); //匹配到一个玩家 ，发送到客户端
                            if (match_count_1 >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) { //匹配完成
                                this.on_server_match_success(zoom.in_match_list, Number(roomlevel)); //发送到客户端，服务端已经匹配完成
                                this.del_match_success_player_from_math_list(zoom.in_match_list, zoom.match_list); //匹配完成的人（in_match_list）从待匹配列表(match_list)删除
                                this.del_in_match_player(zoom.in_match_list); //从匹配完成列表(in_match_list)中删除
                            }
                        }
                    }
                }
            }
        }
    };
    //创建房间，进入玩家，发送到发送到客户端
    //in_match_list:匹配成功玩家 Matching
    MatchManager.prototype.on_server_match_success = function (in_match_list, roomlevel) {
        var room = RoomManager_1["default"].getInstance().alloc_room();
        room.set_game_rule(JSON.stringify(GameHoodleConfig_1["default"].MATCH_GAME_RULE));
        room.set_is_match_room(true);
        room.set_match_roomlevel(roomlevel);
        for (var key in in_match_list) {
            var player = in_match_list[key];
            player.set_offline(false);
            if (!room.add_player(player)) {
                Log_1["default"].warn("on_server_match_success enter room error");
                room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserMatchRes, { status: Response_1["default"].INVALIDI_OPT });
                RoomManager_1["default"].getInstance().delete_room(room.get_room_id());
                return;
            }
        }
        this.set_room_host(room);
        var body = {
            status: Response_1["default"].OK,
            matchsuccess: true
        };
        room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserMatchRes, body);
    };
    //设置房主: 匹配成功后，选择先匹配的玩家是房主
    //设置房主:room房间
    MatchManager.prototype.set_room_host = function (room) {
        var player_list = room.get_all_player();
        if (ArrayUtil_1["default"].GetArrayLen(player_list) <= 0) {
            return;
        }
        var index = 0;
        for (var key in player_list) {
            index++;
            var player = player_list[key];
            if (index == 1) {
                if (player) {
                    player.set_ishost(true);
                    room.set_room_host_uid(player.get_uid());
                }
            }
            else {
                if (player) {
                    player.set_ishost(false);
                }
            }
        }
    };
    //发送匹配列表中的玩家
    MatchManager.prototype.send_match_player = function (in_match_list) {
        var userinfo_array = [];
        for (var key in in_match_list) {
            var player = in_match_list[key];
            if (player) {
                var userinfo = {
                    numberid: String(player.get_numberid()),
                    userinfostring: JSON.stringify(player.get_player_info())
                };
                userinfo_array.push(userinfo);
            }
        }
        var body = {
            status: Response_1["default"].OK,
            matchsuccess: false,
            userinfo: userinfo_array
        };
        for (var key in in_match_list) {
            var player = in_match_list[key];
            if (player) {
                player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, body);
            }
        }
    };
    //获取正在等待列表中，未进入匹配的玩家  inview状态
    MatchManager.prototype.get_matching_player = function (zoom) {
        for (var key in zoom.match_list) {
            var player = zoom.match_list[key];
            if (player.get_user_state() == State_1.UserState.InView) {
                return player;
            }
        }
    };
    //获取正在匹配中的玩家，进入匹配状态，matching状态
    MatchManager.prototype.get_in_matching_player = function (zoom) {
        for (var key in zoom.in_match_list) {
            var p = zoom.in_match_list[key];
            if (p.get_user_state() == State_1.UserState.MatchIng) {
                return p;
            }
        }
    };
    //匹配中的列表人数 Matching 
    MatchManager.prototype.get_in_match_player_count = function (zoom) {
        var count = 0;
        for (var key in zoom.in_match_list) {
            var player = zoom.in_match_list[key];
            if (player && player.get_user_state() == State_1.UserState.MatchIng) {
                count++;
            }
        }
        return count;
    };
    //从待匹配列表中将匹配完成的人删掉
    MatchManager.prototype.del_match_success_player_from_math_list = function (in_match_list, match_list) {
        for (var key in in_match_list) {
            var mplayer = in_match_list[key];
            if (mplayer) {
                this.del_player_from_match_list_by_uid(mplayer.get_uid(), match_list);
            }
        }
    };
    //删除匹配完成列表的人 Matching状态
    MatchManager.prototype.del_in_match_player = function (in_match_list) {
        var key_set = [];
        var _this = this;
        for (var key in in_match_list) {
            var player = in_match_list[key];
            if (player) {
                player.set_user_state(State_1.UserState.InView);
                key_set.push(player.get_uid());
            }
        }
        key_set.forEach(function (uid) {
            _this.del_player_from_in_match_list_by_uid(uid, in_match_list);
        });
        in_match_list = {};
    };
    //添加到待匹配列表 Inview
    MatchManager.prototype.add_player_to_match_list = function (player, match_room_conf) {
        Log_1["default"].info("hcc>>match_room_conf:", match_room_conf);
        var roomlevel = match_room_conf.roomlevel;
        if (!roomlevel) {
            return false;
        }
        var zoom = this._zoom_list[roomlevel]; //匹配房间区间
        if (!zoom) {
            return false;
        }
        if (zoom.match_list[player.get_uid()]) {
            Log_1["default"].info("hcc>>player uid: " + player.get_uid() + " is already in match");
            return false;
        }
        if (roomMgr.get_room_by_uid(player.get_uid())) {
            Log_1["default"].info("hcc>>player uid: " + player.get_uid() + " is already in room");
            return false;
        }
        zoom.match_list[player.get_uid()] = player;
        player.set_user_state(State_1.UserState.InView);
        return true;
    };
    //添加到匹配完成列表中 inview-> Matching
    MatchManager.prototype.add_player_to_in_match_list = function (player, zoom) {
        if (!player) {
            return false;
        }
        if (player.get_user_state() != State_1.UserState.InView) {
            return false;
        }
        if (roomMgr.get_room_by_uid(player.get_uid())) {
            Log_1["default"].info("hcc>>player uid: " + player.get_uid() + " is already in room");
            return false;
        }
        if (this.get_in_match_player_count(zoom) >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
            return false;
        }
        if (ArrayUtil_1["default"].GetArrayLen(zoom.in_match_list) >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
            return false;
        }
        //不能同时匹配两个机器人
        if (player.is_robot()) {
            for (var idx in zoom.in_match_list) {
                var in_player = zoom.in_match_list[idx];
                if (in_player.is_robot()) {
                    return false;
                }
            }
        }
        zoom.in_match_list[player.get_uid()] = player;
        player.set_user_state(State_1.UserState.MatchIng);
        return true;
    };
    //从待匹配的列表中删除 inview
    MatchManager.prototype.del_player_from_match_list_by_uid = function (uid, match_list) {
        var player = match_list[uid];
        if (player) {
            player.set_user_state(State_1.UserState.InView);
            match_list[uid] = null;
            delete match_list[uid];
            return true;
        }
        return false;
    };
    //从匹配中的列表中删除 inview
    MatchManager.prototype.del_player_from_in_match_list_by_uid = function (uid, in_match_list) {
        var player = in_match_list[uid];
        if (player) {
            player.set_user_state(State_1.UserState.InView);
            in_match_list[uid] = null;
            delete in_match_list[uid];
            return true;
        }
        return false;
    };
    //用户取消匹配,从匹配队列和匹配中删掉
    MatchManager.prototype.stop_player_match = function (uid) {
        var result = false;
        for (var roomlevel in this._zoom_list) {
            var zoom = this._zoom_list[roomlevel];
            var ret = this.del_player_from_match_list_by_uid(uid, zoom.match_list);
            var ret_in = this.del_player_from_in_match_list_by_uid(uid, zoom.in_match_list);
            var tmpresult = ret || ret_in;
            if (tmpresult) {
                result = true;
            }
        }
        return result;
    };
    //计算匹配列表人数 inview
    MatchManager.prototype.count_match_list = function () {
        var count = 0;
        for (var roomlevel in this._zoom_list) {
            var zoom = this._zoom_list[roomlevel];
            var match_list_count = ArrayUtil_1["default"].GetArrayLen(zoom.match_list);
            count += match_list_count;
        }
        return count;
    };
    //匹配状态玩家数量 matching
    MatchManager.prototype.count_in_match_list = function () {
        var count = 0;
        for (var roomlevel in this._zoom_list) {
            var zoom = this._zoom_list[roomlevel];
            var match_list_count = ArrayUtil_1["default"].GetArrayLen(zoom.in_match_list);
            count += match_list_count;
        }
        return count;
    };
    //打印统计列表
    MatchManager.prototype.log_match_list = function () {
        var name_str = "";
        var in_match_name_str = "";
        for (var roomlevel in this._zoom_list) {
            var zoom = this._zoom_list[roomlevel];
            for (var key in zoom.match_list) {
                var player = zoom.match_list[key];
                var uname = player.get_unick();
                var state = player.get_user_state();
                name_str = name_str + "[" + uname + ",lev:" + roomlevel + "] "; // ",state:" + state +  "  ,"
            }
            for (var key in zoom.in_match_list) {
                var player = zoom.in_match_list[key];
                var uname = player.get_unick();
                var state = player.get_user_state();
                in_match_name_str = in_match_name_str + "[" + uname + ",lev:" + roomlevel + "] "; //+ ",state:" + state + "  ,"
            }
        }
        if (name_str == "") {
            name_str = "none";
        }
        if (in_match_name_str == "") {
            in_match_name_str = "none";
        }
        Log_1["default"].info("\n");
        Log_1["default"].info("matchlist_len:" + this.count_match_list() + " ==>" + name_str);
        Log_1["default"].info("in_matchlist_len:" + this.count_in_match_list() + " ==>" + in_match_name_str);
    };
    /////////////////////////////////////////
    //查找房间逻辑,只找匹配房间，不找自建房
    MatchManager.prototype.get_not_full_room = function (roomlevel) {
        var room_list = RoomManager_1["default"].getInstance().get_all_room();
        for (var key in room_list) {
            var room = room_list[key];
            // Log.info("playercount: ", room.get_player_count(), " ,confplayercount: ", room.get_conf_player_count());
            if (room.get_match_roomlevel() == roomlevel) {
                if (room.get_is_match_room() && room.get_player_count() < room.get_conf_player_count()) {
                    if (room.get_game_state() == State_1.GameState.InView) {
                        return room;
                    }
                }
            }
        }
        return null;
    };
    MatchManager.Instance = new MatchManager();
    return MatchManager;
}());
exports["default"] = MatchManager;
//# sourceMappingURL=MatchManager.js.map