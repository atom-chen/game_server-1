"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleProto_1 = require("../../../protocol/GameHoodleProto");
var Log_1 = __importDefault(require("../../../../utils/Log"));
var Response_1 = __importDefault(require("../../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../PlayerManager"));
var RoomManager_1 = __importDefault(require("../RoomManager"));
var GameFunction_1 = __importDefault(require("./GameFunction"));
var MatchManager_1 = __importDefault(require("../MatchManager"));
var GameSendMsg_1 = __importDefault(require("../GameSendMsg"));
var State_1 = require("../config/State");
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var matchMgr = MatchManager_1["default"].getInstance();
var GameLinkInterface = /** @class */ (function () {
    function GameLinkInterface() {
    }
    //玩家断线
    GameLinkInterface.do_player_lost_connect = function (utag) {
        var player = playerMgr.get_player(utag);
        if (player) {
            //设置房间内玩家掉线
            var room = roomMgr.get_room_by_uid(utag);
            if (room) {
                player.set_offline(true);
                room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserOfflineRes, { seatid: player.get_seat_id() }, player);
                GameFunction_1["default"].broadcast_player_info_in_rooom(room, player);
            }
            //删掉玩家对象，但是如果在房间里面，玩家引用还会在房间里面，方便下次重连
            var uname = player.get_unick();
            var numid = player.get_numberid();
            var issuccess = playerMgr.delete_player(utag);
            if (issuccess) {
                Log_1["default"].warn(uname + " ,numid:" + numid + " is lostconnect,totalPlyaerCount: " + playerMgr.get_player_count());
            }
            //如果在匹配，就从匹配列表中删除
            var ret = matchMgr.stop_player_match(player.get_uid());
            if (ret) {
                Log_1["default"].info(uname, "delete from match");
            }
            //如果在匹配房间内游戏还没开始，达到条件房间就解散
            if (room && room.get_is_match_room()) {
                if (room.get_game_state() != State_1.GameState.InView) { //游戏已经开始，不能直接解散
                    return;
                }
                //游戏还没开始，而且没有在线玩家，房间解散
                var playerCount = room.get_player_count();
                var onlinePlayerCount = room.get_online_player_count();
                Log_1["default"].info("hcc>>do_player_lost_connect: playerCouont: ", playerCount, " ,onlinePlayerCount: ", onlinePlayerCount);
                if (playerCount == 0 || onlinePlayerCount == 0) {
                    room.kick_all_player();
                    var roomID = room.get_room_id();
                    var ret_1 = roomMgr.delete_room(roomID);
                    Log_1["default"].info("hcc>>do_player_lost_connect>>delete room :", ret_1, " ,roomid: ", roomID);
                }
            }
        }
    };
    //玩家登录逻辑服务
    GameLinkInterface.do_player_login_logic_server = function (session, utag, proto_type) {
        var player = playerMgr.get_player(utag);
        if (player) {
            Log_1["default"].info("player is exist, uid: ", utag);
            player.init_session(session, utag, proto_type, function (status, data) {
                if (status == Response_1["default"].OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    var room = roomMgr.get_room_by_uid(utag);
                    if (room) {
                        var oldPlayer = room.get_player(utag);
                        if (oldPlayer) {
                            player.set_player_info(oldPlayer.get_player_info());
                        }
                    }
                    GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].OK });
                }
                else {
                    GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                }
            });
        }
        else {
            Log_1["default"].info("player is not exist , new player uid: ", utag);
            playerMgr.alloc_player(session, utag, proto_type, function (status, data) {
                if (status == Response_1["default"].OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    var newPlayer = playerMgr.get_player(utag);
                    var room = roomMgr.get_room_by_uid(utag);
                    if (room) {
                        var oldPlayer = room.get_player(utag);
                        if (oldPlayer) {
                            newPlayer.set_player_info(oldPlayer.get_player_info());
                        }
                    }
                    GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].OK });
                }
                else {
                    GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                }
            });
        }
    };
    return GameLinkInterface;
}());
exports["default"] = GameLinkInterface;
//# sourceMappingURL=GameLinkInterface.js.map