"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var GameHoodleProto_1 = require("../../protocol/GameHoodleProto");
var GameSendMsg_1 = __importDefault(require("./GameSendMsg"));
var CommonProto_1 = __importDefault(require("../../protocol/CommonProto"));
var PlayerManager_1 = __importDefault(require("./PlayerManager"));
var RoomManager_1 = __importDefault(require("./RoomManager"));
var Response_1 = __importDefault(require("../../Response"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var State_1 = require("./State");
var GameHoodleInterface_1 = __importDefault(require("./GameHoodleInterface"));
var GameHoodleLogicInterface_1 = __importDefault(require("./GameHoodleLogicInterface"));
var MatchManager_1 = __importDefault(require("./MatchManager"));
var GameHoodleModle = /** @class */ (function () {
    function GameHoodleModle() {
    }
    GameHoodleModle.getInstance = function () {
        return GameHoodleModle.Instance;
    };
    GameHoodleModle.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    GameHoodleModle.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        Log_1["default"].info("recv_cmd_msg: ", stype, ctype, utag, proto_type, this.decode_cmd(proto_type, raw_cmd));
        switch (ctype) {
            case CommonProto_1["default"].eUserLostConnectRes:
                this.on_user_lost_connect(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eLoginLogicReq:
                this.on_login_logic(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eCreateRoomReq:
                this.on_create_room(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eJoinRoomReq:
                this.on_join_room(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eExitRoomReq:
                this.on_exit_room(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eDessolveReq:
                this.on_dessolve_room(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eGetRoomStatusReq:
                this.on_get_room_status(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eBackRoomReq:
                this.on_back_room(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eCheckLinkGameReq:
                this.on_check_link_game(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eUserReadyReq:
                this.on_user_ready(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.ePlayerShootReq:
                this.on_player_shoot(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.ePlayerBallPosReq:
                this.on_player_ball_pos(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.ePlayerIsShootedReq:
                this.on_player_is_shooted(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eUserMatchReq:
                this.on_user_match(session, utag, proto_type, raw_cmd);
                break;
            case GameHoodleProto_1.Cmd.eUserStopMatchReq:
                this.on_user_stop_match(session, utag, proto_type, raw_cmd);
                break;
            default:
                break;
        }
    };
    //玩家离开逻辑服务
    GameHoodleModle.prototype.on_user_lost_connect = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].warn("game on_user_lost_connect utag:", utag, body);
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        if (player) {
            var room = RoomManager_1["default"].getInstance().get_room_by_uid(utag);
            if (room) {
                player.set_offline(true);
                //send to room other player user lost connect
                room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserOfflineRes, { seatid: player.get_seat_id() }, player);
                GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room, player);
            }
        }
        PlayerManager_1["default"].getInstance().delete_player(utag);
    };
    //登录逻辑服务
    GameHoodleModle.prototype.on_login_logic = function (session, utag, proto_type, raw_cmd) {
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        if (player) {
            Log_1["default"].info("player is exist, uid: ", utag);
            player.init_session(session, utag, proto_type, function (status, data) {
                if (status == Response_1["default"].OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    var room = RoomManager_1["default"].getInstance().get_room_by_uid(utag);
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
            PlayerManager_1["default"].getInstance().alloc_player(session, utag, proto_type, function (status, data) {
                if (status == Response_1["default"].OK) {
                    //如果是重连进来，需要重新获取老玩家的信息
                    var newPlayer = PlayerManager_1["default"].getInstance().get_player(utag);
                    var room = RoomManager_1["default"].getInstance().get_room_by_uid(utag);
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
    //创建房间
    GameHoodleModle.prototype.on_create_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("create_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var rmanager = RoomManager_1["default"].getInstance();
        if (rmanager.get_room_by_uid(player.get_uid())) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("create room error, already create one");
            return;
        }
        var room = RoomManager_1["default"].getInstance().alloc_room();
        if (!room) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
            Log_1["default"].warn("create room error, alloc room error");
            return;
        }
        var body = this.decode_cmd(proto_type, raw_cmd);
        if (body) {
            room.set_game_rule(body.gamerule);
            Log_1["default"].info("create room, gamerule: ", body);
        }
        if (!room.add_player(player)) {
            Log_1["default"].warn("create room error,add host player error");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            RoomManager_1["default"].getInstance().delete_room(room.get_room_id());
            return;
        }
        room.set_room_host_uid(player.get_uid());
        player.set_offline(false);
        player.set_ishost(true);
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCreateRoomRes, utag, proto_type, { status: Response_1["default"].OK });
    };
    //加入房间
    GameHoodleModle.prototype.on_join_room = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("join_room error, player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var roomid = body.roomid;
        if (!roomid || roomid == "") {
            Log_1["default"].warn("join_room error, roomid", roomid, "is invalid");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
            return;
        }
        var room = RoomManager_1["default"].getInstance().get_room_by_roomid(roomid);
        if (!room) {
            Log_1["default"].warn("join_room error, room is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
            return;
        }
        //自己创建了一个房间，不能加入其它人的房间，只能加入自己的房间
        var uroom = RoomManager_1["default"].getInstance().get_room_by_uid(utag);
        var is_back_room = false;
        if (uroom) {
            //自己已经创建了一个房间
            if (room.get_room_id() !== uroom.get_room_id()) {
                Log_1["default"].warn("join_room error, player is create one room!");
                GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                return;
            }
            //掉线返回房间
            if (room.get_room_id() == uroom.get_room_id()) {
                is_back_room = true;
            }
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        if (!room.add_player(player, is_back_room)) {
            Log_1["default"].warn("join_room error");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        player.set_offline(false);
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eJoinRoomRes, utag, proto_type, { status: Response_1["default"].OK });
        //send uinfo to other player in room
        GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room, player);
        Log_1["default"].info("join_room success, roomid: ", room.get_room_id());
    };
    //离开房间
    GameHoodleModle.prototype.on_exit_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("exit_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eExitRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var rmanager = RoomManager_1["default"].getInstance();
        var room = rmanager.get_room_by_uid(player.get_uid());
        if (!room) {
            Log_1["default"].warn("exit_room error, room is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eExitRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        //start game
        if (room.get_game_state() != State_1.GameState.InView) {
            Log_1["default"].warn("exit_room error, game is start !");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eExitRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        if (room.is_room_host(player.get_uid())) {
            player.set_offline(true);
        }
        else {
            room.kick_player(player.get_uid());
            player.clear_room_info();
        }
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eExitRoomRes, utag, proto_type, { status: Response_1["default"].OK });
        GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room);
    };
    //解散房间
    GameHoodleModle.prototype.on_dessolve_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("dessolve_room error, player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var rmanager = RoomManager_1["default"].getInstance();
        var room = rmanager.get_room_by_uid(player.get_uid());
        if (!room) {
            Log_1["default"].warn("dessolve_room error, room is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        if (room.is_room_host(player.get_uid()) == false) {
            Log_1["default"].warn("dessolve_room error, player is not host!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var roomID = room.get_room_id();
        var ret = rmanager.delete_room(roomID);
        if (ret == false) {
            Log_1["default"].warn("dessolve_room error ,roomid: ", roomID, "is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        room.broadcast_in_room(GameHoodleProto_1.Cmd.eDessolveRes, { status: Response_1["default"].OK }, player);
        room.kick_all_player();
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eDessolveRes, utag, proto_type, { status: Response_1["default"].OK });
    };
    //获取是否创建过房间
    GameHoodleModle.prototype.on_get_room_status = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("get_room_status player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eGetRoomStatusRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (!room) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eGetRoomStatusRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
            Log_1["default"].info("get_room_status , player is not in room");
            return;
        }
        Log_1["default"].info("get_room_status player is in room! roomid: ", room.get_room_id());
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eGetRoomStatusRes, utag, proto_type, { status: Response_1["default"].OK });
    };
    //返回房间
    GameHoodleModle.prototype.on_back_room = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("back_room player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eBackRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var rmanager = RoomManager_1["default"].getInstance();
        var room = rmanager.get_room_by_uid(player.get_uid());
        if (!room) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eBackRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("back_room error, player is not in room");
            return;
        }
        Log_1["default"].info("back room success! roomid: ", room.get_room_id());
        player.set_offline(false);
        if (room.is_room_host(player.get_uid())) {
            player.set_ishost(true);
        }
        if (!room.add_player(player, true)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eBackRoomRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("back room error!");
            return;
        }
        GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eBackRoomRes, utag, proto_type, { status: Response_1["default"].OK });
        GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room, player);
    };
    //进游戏房间后，服务推送房间内信息
    GameHoodleModle.prototype.on_check_link_game = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("check_link_game player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eCheckLinkGameRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        if (!GameHoodleInterface_1["default"].check_room(utag)) {
            Log_1["default"].warn("check_link_game room is not exist!");
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            GameHoodleInterface_1["default"].send_player_info(player);
            player.send_cmd(GameHoodleProto_1.Cmd.eCheckLinkGameRes, { status: Response_1["default"].OK });
            player.send_cmd(GameHoodleProto_1.Cmd.eRoomIdRes, { roomid: room.get_room_id() });
            player.send_cmd(GameHoodleProto_1.Cmd.eGameRuleRes, { gamerule: room.get_game_rule() });
            player.send_cmd(GameHoodleProto_1.Cmd.ePlayCountRes, { playcount: String(room.get_play_count()), totalplaycount: String(room.get_conf_play_count()) });
            //处理断线重连,只发送给重连玩家
            //玩家位置，局数，玩家权限，玩家得分
            //TODO
            if (room.get_game_state() == State_1.GameState.Gameing) {
                player.send_cmd(GameHoodleProto_1.Cmd.eGameStartRes, { status: Response_1["default"].OK });
                GameHoodleLogicInterface_1["default"].send_player_ball_pos(room, undefined, player);
                GameHoodleLogicInterface_1["default"].send_player_power(room, undefined, player);
                GameHoodleLogicInterface_1["default"].send_player_score(room, undefined, player);
            }
        }
    };
    //玩家准备
    GameHoodleModle.prototype.on_user_ready = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_user_ready player is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        if (!GameHoodleInterface_1["default"].check_room(utag)) {
            Log_1["default"].warn("on_user_ready room is not exist!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var userstate = player.get_user_state();
        if (userstate == State_1.UserState.Ready || userstate == State_1.UserState.Playing) {
            Log_1["default"].warn("on_user_ready user is already ready or is playing!");
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            //已经在游戏中了
            if (room.get_game_state() == State_1.GameState.Gameing) {
                GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                Log_1["default"].warn("on_user_ready error ,game is playing!");
                return;
            }
            //已经大结算了
            if (room.get_play_count() == room.get_conf_play_count()) {
                GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserReadyRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                Log_1["default"].warn("on_user_ready error ,game is over!");
                return;
            }
            //有玩家准备了，发送状态
            player.set_user_state(State_1.UserState.Ready);
            GameHoodleInterface_1["default"].send_player_state(room, player);
            //游戏开始了
            var is_game_start = GameHoodleInterface_1["default"].check_game_start(room);
            if (is_game_start) {
                GameHoodleInterface_1["default"].set_all_player_state(room, State_1.UserState.Playing);
                GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room); //刷新局内玩家信息：Playing
                //设置游戏状态为游戏中
                room.set_game_state(State_1.GameState.Gameing);
                //发送游戏开始
                room.broadcast_in_room(GameHoodleProto_1.Cmd.eGameStartRes, { status: Response_1["default"].OK });
                //游戏逻辑发送
                GameHoodleLogicInterface_1["default"].send_player_first_pos(room);
                //设置初始权限
                GameHoodleLogicInterface_1["default"].set_player_start_power(room);
                //玩家权限发送
                GameHoodleLogicInterface_1["default"].send_player_power(room);
                //发送分数
                GameHoodleLogicInterface_1["default"].send_player_score(room);
                //局数自加
                room.set_play_count(room.get_play_count() + 1);
                //发送局数
                GameHoodleInterface_1["default"].send_play_count(room);
            }
        }
    };
    //玩家射击
    GameHoodleModle.prototype.on_player_shoot = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_shoot player is not exist!");
            return;
        }
        if (!GameHoodleInterface_1["default"].check_room(utag)) {
            Log_1["default"].warn("on_player_shoot room is not exist!");
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var userstate = player.get_user_state();
        if (userstate != State_1.UserState.Playing) {
            Log_1["default"].warn("on_player_shoot user is not in playing state!");
            return;
        }
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != State_1.GameState.Gameing) {
                Log_1["default"].warn("on_player_shoot room is not in playing state!");
                return;
            }
            //发送玩家射击信息
            var body = this.decode_cmd(proto_type, raw_cmd);
            GameHoodleLogicInterface_1["default"].send_player_shoot(room, body, player);
            //设置下一个玩家射击权限
            GameHoodleLogicInterface_1["default"].set_next_player_power(room);
            //发送权限
            GameHoodleLogicInterface_1["default"].send_player_power(room);
        }
    };
    //玩家位置信息
    GameHoodleModle.prototype.on_player_ball_pos = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_ball_pos player is not exist!");
            return;
        }
        if (!GameHoodleInterface_1["default"].check_room(utag)) {
            Log_1["default"].warn("on_player_ball_pos room is not exist!");
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var userstate = player.get_user_state();
        if (userstate != State_1.UserState.Playing) {
            Log_1["default"].warn("on_player_ball_pos user is not in playing state!");
            return;
        }
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != State_1.GameState.Gameing) {
                Log_1["default"].warn("on_player_ball_pos room is not in playing state!");
                return;
            }
            var player_set = room.get_all_player();
            //保存玩家位置信息
            var body = this.decode_cmd(proto_type, raw_cmd);
            // Log.info("hcc>>on_player_ball_pos ", body);
            for (var key in body.positions) {
                var posinfo = body.positions[key];
                var seatid = posinfo.seatid;
                var posx = posinfo.posx;
                var posy = posinfo.posy;
                for (var k in player_set) {
                    var p = player_set[k];
                    if (p && p.get_seat_id() == seatid) {
                        var pos_info = { posx: posx, posy: posy };
                        p.set_user_pos(pos_info);
                        break;
                    }
                }
            }
            GameHoodleLogicInterface_1["default"].send_player_ball_pos(room);
        }
    };
    //玩家被射中
    GameHoodleModle.prototype.on_player_is_shooted = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            Log_1["default"].warn("on_player_is_shooted player is not exist!");
            return;
        }
        if (!GameHoodleInterface_1["default"].check_room(utag)) {
            Log_1["default"].warn("on_player_is_shooted room is not exist!");
            return;
        }
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var userstate = player.get_user_state();
        if (userstate != State_1.UserState.Playing) {
            Log_1["default"].warn("on_player_is_shooted user is not in playing state!");
            return;
        }
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            if (room.get_game_state() != State_1.GameState.Gameing) {
                Log_1["default"].warn("on_player_is_shooted room is not in playing state!");
                return;
            }
            //先转发射中消息
            var body = this.decode_cmd(proto_type, raw_cmd);
            GameHoodleLogicInterface_1["default"].send_player_is_shooted(room, body);
            //分数计算
            var src_player = room.get_player_by_seatid(body.srcseatid);
            var des_player = room.get_player_by_seatid(body.desseatid);
            if (src_player && des_player) {
                src_player.set_user_score(src_player.get_user_score() + 1);
                des_player.set_user_score(des_player.get_user_score() - 1);
                Log_1["default"].info("hcc>>playerScore: ", src_player.get_user_score(), des_player.get_user_score());
            }
            //发送分数
            GameHoodleLogicInterface_1["default"].send_player_score(room);
            //设置游戏状态为结算状态
            room.set_game_state(State_1.GameState.CheckOut);
            //发送结算
            GameHoodleLogicInterface_1["default"].send_game_result(room);
            //发送玩家状态
            GameHoodleInterface_1["default"].set_all_player_state(room, State_1.UserState.InView);
            GameHoodleInterface_1["default"].broadcast_player_info_in_rooom(room);
            //清除上一局数据
            GameHoodleLogicInterface_1["default"].clear_all_player_cur_data(room);
            //发送权限
            GameHoodleLogicInterface_1["default"].send_player_power(room);
            //大结算: 踢出所有玩家，房间解散
            if (room.get_play_count() == room.get_conf_play_count()) {
                GameHoodleLogicInterface_1["default"].send_game_total_result(room);
                room.kick_all_player();
                RoomManager_1["default"].getInstance().delete_room(room.get_room_id());
            }
        }
    };
    GameHoodleModle.prototype.on_user_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_user_match player is not exist!");
            return;
        }
        var match_mgr = MatchManager_1["default"].getInstance();
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        //如果在房间内，不能匹配
        var room = RoomManager_1["default"].getInstance().get_room_by_uid(player.get_uid());
        if (room) {
            Log_1["default"].warn("on_user_match error user is at room!");
            player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        var ret = match_mgr.add_player_to_match_list(player);
        if (!ret) {
            Log_1["default"].warn("on_user_match error user is in matching!");
            player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, { status: Response_1["default"].NOT_YOUR_TURN });
            return;
        }
        player.send_cmd(GameHoodleProto_1.Cmd.eUserMatchRes, { status: Response_1["default"].OK });
        Log_1["default"].warn("on_user_match user add matching success!");
    };
    GameHoodleModle.prototype.on_user_stop_match = function (session, utag, proto_type, raw_cmd) {
        if (!GameHoodleInterface_1["default"].check_player(utag)) {
            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eUserStopMatchRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            Log_1["default"].warn("on_user_stop_match error player is not exist!");
            return;
        }
        var match_mgr = MatchManager_1["default"].getInstance();
        var player = PlayerManager_1["default"].getInstance().get_player(utag);
        var ret = match_mgr.del_player_from_match_list_by_uid(player.get_uid());
        if (!ret) {
            Log_1["default"].warn("on_user_stop_match failed!");
            player.send_cmd(GameHoodleProto_1.Cmd.eUserStopMatchRes, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        player.send_cmd(GameHoodleProto_1.Cmd.eUserStopMatchRes, { status: Response_1["default"].OK });
        match_mgr.send_match_player();
    };
    GameHoodleModle.Instance = new GameHoodleModle();
    return GameHoodleModle;
}());
exports["default"] = GameHoodleModle;
//# sourceMappingURL=GameHoodleModle.js.map