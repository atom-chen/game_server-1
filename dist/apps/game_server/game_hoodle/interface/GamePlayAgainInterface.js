"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleProto_1 = require("../../../protocol/GameHoodleProto");
var Log_1 = __importDefault(require("../../../../utils/Log"));
var Response_1 = __importDefault(require("../../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../PlayerManager"));
var ProtoManager_1 = __importDefault(require("../../../../netbus/ProtoManager"));
var RoomManager_1 = __importDefault(require("../RoomManager"));
var ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var playerMgr = PlayerManager_1["default"].getInstance();
var GamePlayAgainInterface = /** @class */ (function () {
    function GamePlayAgainInterface() {
    }
    //玩家请求再次对局
    GamePlayAgainInterface.do_player_play_again_req = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (body && body.otheruids) {
            var otheruids = body.otheruids;
            var configObj = {
                requserunick: player.get_unick(),
                requseruid: player.get_uid()
            };
            var resBody_1 = {
                status: Response_1["default"].OK,
                ansconfig: JSON.stringify(configObj)
            };
            otheruids.forEach(function (uid) {
                var invitePlayer = playerMgr.get_player(uid);
                if (invitePlayer) {
                    invitePlayer.send_cmd(GameHoodleProto_1.Cmd.eUserPlayAgainAnswerRes, resBody_1);
                }
            });
        }
        player.send_cmd(GameHoodleProto_1.Cmd.eUserPlayAgainRes, { status: Response_1["default"].OK });
    };
    //玩家回应邀请
    GamePlayAgainInterface.do_player_play_again_answer = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag); //回应玩家
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (body) {
            var requseruid = body.requseruid;
            var responsecode = body.responsecode;
            var resBody = {
                status: Response_1["default"].OK,
                responsecode: responsecode
            };
            var invitePlayer = playerMgr.get_player(requseruid); //请求玩家
            var player_list = [];
            player_list.push(player);
            player_list.push(invitePlayer);
            if (invitePlayer) {
                invitePlayer.send_cmd(GameHoodleProto_1.Cmd.eUserPlayAgainRes, resBody);
                if (responsecode == Response_1["default"].OK) {
                    GamePlayAgainInterface.player_play_again(player_list);
                }
            }
        }
    };
    GamePlayAgainInterface.player_play_again = function (player_list) {
        if (!player_list || ArrayUtil_1["default"].GetArrayLen(player_list) <= 1) {
            return;
        }
        var room = RoomManager_1["default"].getInstance().alloc_room();
        room.set_game_rule(JSON.stringify(GameHoodleConfig_1["default"].MATCH_GAME_RULE));
        room.set_is_match_room(true);
        for (var key in player_list) {
            var player = player_list[key];
            player.set_offline(false);
            if (!room.add_player(player)) {
                Log_1["default"].warn("player_play_again enter room error");
                RoomManager_1["default"].getInstance().delete_room(room.get_room_id());
                return;
            }
        }
        GamePlayAgainInterface.set_room_host(room);
        room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserPlayAgainStartRes, { status: Response_1["default"].OK }); //通知玩家，开始游戏
    };
    //设置房主:room房间
    GamePlayAgainInterface.set_room_host = function (room) {
        var player_list = room.get_all_player();
        if (ArrayUtil_1["default"].GetArrayLen(player_list) <= 0) {
            return;
        }
        var index = 0;
        for (var key in player_list) {
            index++;
            if (index == 1) {
                var player = player_list[key];
                if (player) {
                    player.set_ishost(true);
                    room.set_room_host_uid(player.get_uid());
                }
                break;
            }
        }
    };
    return GamePlayAgainInterface;
}());
exports["default"] = GamePlayAgainInterface;
//# sourceMappingURL=GamePlayAgainInterface.js.map