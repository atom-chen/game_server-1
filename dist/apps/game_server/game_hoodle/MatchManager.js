"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var State_1 = require("./config/State");
var RoomManager_1 = __importDefault(require("./RoomManager"));
var GameHoodleProto_1 = require("../../protocol/GameHoodleProto");
var GameHoodleConfig_1 = __importDefault(require("./config/GameHoodleConfig"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var GameFunction_1 = __importDefault(require("./interface/GameFunction"));
var MatchManager = /** @class */ (function () {
    function MatchManager() {
        this._match_list = {}; // uid->player  匹配列表，还没进入匹配的人， inview状态
        this._in_match_list = {}; // uid->player  匹配到的人数, matching 状态
    }
    MatchManager.getInstance = function () {
        return MatchManager.Instance;
    };
    //开始匹配
    MatchManager.prototype.start_match = function () {
        var _this = this;
        //先找没满人的房间，再找匹配列表中的人
        setInterval(function () {
            var not_full_room = _this.get_not_full_room();
            if (not_full_room) { //查找人没满的房间
                var player = _this.get_matching_player();
                if (!player) {
                    player = _this.get_in_matching_player();
                }
                if (player) {
                    var is_success = not_full_room.add_player(player);
                    if (is_success) {
                        _this.send_match_player(not_full_room.get_all_player());
                        player.set_offline(false);
                        _this.set_room_host(not_full_room);
                        var body = {
                            status: Response_1["default"].OK,
                            matchsuccess: true
                        };
                        player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, body);
                        GameFunction_1["default"].broadcast_player_info_in_rooom(not_full_room, player);
                        var tmp_match_list = {};
                        tmp_match_list[player.get_uid()] = player;
                        _this.del_match_success_player_from_math_list(tmp_match_list); //从待匹配列表删除
                        _this.del_in_match_player(tmp_match_list);
                    }
                }
                else {
                    _this.do_match_player();
                }
            }
            else { //从匹配列表中查找正在匹配中的人
                _this.do_match_player();
            }
            //    _this.log_match_list()
        }.bind(this), GameHoodleConfig_1["default"].MATCH_INTERVAL);
    };
    MatchManager.prototype.do_match_player = function () {
        var player = this.get_matching_player(); //待匹配列表，还没正式进入匹配
        if (player) {
            var match_count = ArrayUtil_1["default"].GetArrayLen(this._in_match_list);
            if (match_count < GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
                var ret = this.add_player_to_in_match_list(player); //加入正式匹配列表
                if (ret) {
                    var tmp_in_match_list = this._in_match_list;
                    var match_count_1 = ArrayUtil_1["default"].GetArrayLen(this._in_match_list);
                    this.send_match_player(tmp_in_match_list); //匹配到一个玩家 ，发送到客户端
                    Log_1["default"].info("hcc>>get_in_match_player_count>> ", match_count_1);
                    if (match_count_1 >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) { //匹配完成
                        Log_1["default"].info("hcc>>match success");
                        this.on_server_match_success(tmp_in_match_list); //发送到客户端，服务端已经匹配完成
                        this.del_match_success_player_from_math_list(tmp_in_match_list); //从待匹配列表删除
                        this.del_in_match_player(tmp_in_match_list); //从匹配完成列表中删除
                    }
                }
            }
        }
    };
    //创建房间，进入玩家，发送到发送到客户端
    //in_match_list:匹配成功玩家 Matching
    MatchManager.prototype.on_server_match_success = function (in_match_list) {
        if (!in_match_list) {
            in_match_list = this._in_match_list;
        }
        var room = RoomManager_1["default"].getInstance().alloc_room();
        room.set_game_rule(JSON.stringify(GameHoodleConfig_1["default"].MATCH_GAME_RULE));
        room.set_is_match_room(true);
        // Log.info("hcc>>in_match_list len: " , ArrayUtil.GetArrayLen(in_match_list))
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
        if (!in_match_list) {
            in_match_list = this._in_match_list;
        }
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
    MatchManager.prototype.get_matching_player = function () {
        for (var key in this._match_list) {
            var p = this._match_list[key];
            if (p.get_user_state() == State_1.UserState.InView) {
                return p;
            }
        }
    };
    MatchManager.prototype.get_in_matching_player = function () {
        for (var key in this._in_match_list) {
            var p = this._in_match_list[key];
            if (p.get_user_state() == State_1.UserState.MatchIng) {
                return p;
            }
        }
    };
    //匹配中的列表人数 Matching 
    MatchManager.prototype.get_in_match_player_count = function () {
        var count = 0;
        for (var key in this._in_match_list) {
            var player = this._in_match_list[key];
            if (player && player.get_user_state() == State_1.UserState.MatchIng) {
                count++;
            }
        }
        return count;
    };
    //从待匹配列表中将匹配完成的人删掉
    MatchManager.prototype.del_match_success_player_from_math_list = function (in_match_list) {
        if (!in_match_list) {
            in_match_list = this._in_match_list;
        }
        for (var key in in_match_list) {
            var mplayer = in_match_list[key];
            if (mplayer) {
                this.del_player_from_match_list_by_uid(mplayer.get_uid());
            }
        }
    };
    //删除匹配完成列表的人 Matching状态
    MatchManager.prototype.del_in_match_player = function (in_match_list) {
        if (!in_match_list) {
            in_match_list = this._in_match_list;
        }
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
            _this.del_player_from_in_match_list_by_uid(uid);
        });
        this._in_match_list = {};
    };
    //添加到待匹配列表 Inview
    MatchManager.prototype.add_player_to_match_list = function (player) {
        if (this._match_list[player.get_uid()]) {
            Log_1["default"].info("hcc>>player uid: " + player.get_uid() + " is already in match");
            return false;
        }
        this._match_list[player.get_uid()] = player;
        player.set_user_state(State_1.UserState.InView);
        return true;
    };
    //添加到匹配完成列表中 inview-> Matching
    MatchManager.prototype.add_player_to_in_match_list = function (player) {
        if (!player) {
            return false;
        }
        if (player.get_user_state() != State_1.UserState.InView) {
            return false;
        }
        if (this.get_in_match_player_count() >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
            return false;
        }
        if (ArrayUtil_1["default"].GetArrayLen(this._in_match_list) >= GameHoodleConfig_1["default"].MATCH_GAME_RULE.playerCount) {
            return false;
        }
        this._in_match_list[player.get_uid()] = player;
        player.set_user_state(State_1.UserState.MatchIng);
        return true;
    };
    //从待匹配的列表中删除 inview
    MatchManager.prototype.del_player_from_match_list_by_uid = function (uid) {
        var player = this._match_list[uid];
        if (player) {
            player.set_user_state(State_1.UserState.InView);
            this._match_list[uid] = null;
            delete this._match_list[uid];
            return true;
        }
        return false;
    };
    //从匹配中的列表中删除 inview
    MatchManager.prototype.del_player_from_in_match_list_by_uid = function (uid) {
        var player = this._in_match_list[uid];
        if (player) {
            player.set_user_state(State_1.UserState.InView);
            this._in_match_list[uid] = null;
            delete this._in_match_list[uid];
            return true;
        }
        return false;
    };
    //用户取消匹配,从匹配队列和匹配中删掉
    MatchManager.prototype.stop_player_match = function (uid) {
        var ret = this.del_player_from_match_list_by_uid(uid);
        var ret_in = this.del_player_from_in_match_list_by_uid(uid);
        return ret || ret_in;
    };
    //计算匹配列表人数 Matching
    MatchManager.prototype.count_match_list = function () {
        return ArrayUtil_1["default"].GetArrayLen(this._match_list);
    };
    //打印统计列表
    MatchManager.prototype.log_match_list = function () {
        var name_str = "";
        for (var key in this._match_list) {
            var player = this._match_list[key];
            var uname = player.get_unick();
            name_str = name_str + uname + "  ,";
        }
        if (name_str == "") {
            name_str = "none";
        }
        Log_1["default"].info("matchlist_len: " + this.count_match_list() + " ,user:", name_str);
    };
    /////////////////////////////////////////
    //查找房间逻辑,只找匹配房间，不找自建房
    MatchManager.prototype.get_not_full_room = function () {
        var room_list = RoomManager_1["default"].getInstance().get_all_room();
        for (var key in room_list) {
            var room = room_list[key];
            if (room.get_is_match_room() && room.get_player_count() < room.get_conf_player_count()) {
                if (room.get_game_state() == State_1.GameState.InView) {
                    return room;
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