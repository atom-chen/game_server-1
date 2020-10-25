"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var GameFunction_1 = __importDefault(require("./GameFunction"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var SendBaseInfo_1 = __importDefault(require("./SendBaseInfo"));
var SendLogicInfo = /** @class */ (function (_super) {
    __extends(SendLogicInfo, _super);
    function SendLogicInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ////////////////////////////////////
    /////发送消息,游戏逻辑相关
    ////////////////////////////////////
    //发送玩家出生位置
    SendLogicInfo.send_player_first_pos = function (room, not_player, only_player) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_pos_array = [];
        var pos_index = 0;
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var pos = GameFunction_1["default"].generate_start_pos(pos_index);
                // Log.info("hcc>>send_player_first_pos: ", pos);
                player.set_user_pos(pos);
                var player_pos = {
                    seatid: Number(player.get_seat_id()),
                    posx: String(pos.posx),
                    posy: String(pos.posy)
                };
                player_pos_array.push(player_pos);
                pos_index++;
            }
        }
        // Log.info("hcc>>send_player_first_pos array: ", player_pos_array);
        if (only_player) {
            only_player.send_cmd(GameHoodleProto_1["default"].XY_ID.ePlayerFirstBallPosRes, { positions: player_pos_array });
        }
        else {
            var not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerFirstBallPosRes, { positions: player_pos_array }, not_uid);
        }
    };
    //发送玩家权限
    SendLogicInfo.send_player_power = function (room, not_player, only_player) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_power_array = [];
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var player_pos = {
                    seatid: Number(player.get_seat_id()),
                    power: Number(player.get_user_power())
                };
                player_power_array.push(player_pos);
            }
        }
        if (only_player) {
            only_player.send_cmd(GameHoodleProto_1["default"].XY_ID.ePlayerPowerRes, { status: Response_1["default"].SUCCESS, powers: player_power_array });
        }
        else {
            var not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerPowerRes, { status: Response_1["default"].SUCCESS, powers: player_power_array }, not_uid);
        }
    };
    //发送玩家射击 ,服务只做转发
    SendLogicInfo.send_player_shoot = function (room, shoot_info, not_uid) {
        if (!room || !shoot_info) {
            return;
        }
        var body = {
            status: Response_1["default"].SUCCESS,
            seatid: Number(shoot_info.seatid),
            posx: String(shoot_info.posx),
            posy: String(shoot_info.posy),
            shootpower: Number(shoot_info.shootpower)
        };
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerShootRes, body, not_uid);
    };
    //发送玩家位置，球停下后
    SendLogicInfo.send_player_ball_pos = function (room, not_player, only_player) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_pos_array = [];
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var player_pos = {
                    seatid: Number(player.get_seat_id()),
                    posx: String(player.get_user_pos().posx),
                    posy: String(player.get_user_pos().posy)
                };
                player_pos_array.push(player_pos);
            }
        }
        if (only_player) {
            only_player.send_cmd(GameHoodleProto_1["default"].XY_ID.ePlayerBallPosRes, { status: Response_1["default"].SUCCESS, positions: player_pos_array });
        }
        else {
            var not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerBallPosRes, { status: Response_1["default"].SUCCESS, positions: player_pos_array }, not_uid);
        }
    };
    //发送玩家射中 ，只做转发
    SendLogicInfo.send_player_is_shooted = function (room, shoot_info) {
        if (!room || !shoot_info) {
            return;
        }
        var body = {
            status: Response_1["default"].SUCCESS,
            srcseatid: Number(shoot_info.srcseatid),
            desseatid: Number(shoot_info.desseatid)
        };
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerIsShootedRes, body);
    };
    //发送小结算
    SendLogicInfo.send_game_result = function (room) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_score_array = [];
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score())
                };
                player_score_array.push(one_score);
            }
        }
        var body = {
            scores: player_score_array,
            isfinal: room.get_cur_play_count() == room.get_max_play_count()
        };
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.eGameResultRes, body);
    };
    //发送大结算
    SendLogicInfo.send_game_total_result = function (room) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_score_array = [];
        var player_golds_array = [];
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score())
                };
                //金币不够情况
                var score = player.get_user_score();
                var gold_win = score * GameHoodleConfig_1["default"].KW_WIN_RATE;
                var one_gold = {
                    seatid: Number(player.get_seat_id()),
                    gold: String(gold_win)
                };
                player_score_array.push(one_score);
                player_golds_array.push(one_gold);
            }
        }
        var body = {
            scores: player_score_array,
            golds: player_golds_array
        };
        room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.eTotalGameResultRes, body);
    };
    //发送玩家得分
    SendLogicInfo.send_player_score = function (room, not_player, only_player) {
        if (!room) {
            return;
        }
        var player_set = room.get_all_player();
        var player_score_array = [];
        for (var key in player_set) {
            var player = player_set[key];
            if (player) {
                var one_score = {
                    seatid: Number(player.get_seat_id()),
                    score: String(player.get_user_score())
                };
                player_score_array.push(one_score);
            }
        }
        if (only_player) {
            only_player.send_cmd(GameHoodleProto_1["default"].XY_ID.ePlayerScoreRes, { scores: player_score_array });
        }
        else {
            var not_uid = not_player ? not_player.get_uid() : undefined;
            room.broadcast_in_room(GameHoodleProto_1["default"].XY_ID.ePlayerScoreRes, { scores: player_score_array }, not_uid);
        }
    };
    return SendLogicInfo;
}(SendBaseInfo_1["default"]));
exports["default"] = SendLogicInfo;
//# sourceMappingURL=SendLogicInfo.js.map