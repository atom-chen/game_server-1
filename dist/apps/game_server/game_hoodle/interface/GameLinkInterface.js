"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleProto_1 = require("../../../protocol/GameHoodleProto");
var Log_1 = __importDefault(require("../../../../utils/Log"));
var Response_1 = __importDefault(require("../../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var GameFunction_1 = __importDefault(require("./GameFunction"));
var MatchManager_1 = __importDefault(require("../manager/MatchManager"));
var GameSendMsg_1 = __importDefault(require("../GameSendMsg"));
var State_1 = require("../config/State");
var ProtoManager_1 = __importDefault(require("../../../../netbus/ProtoManager"));
var RobotManager_1 = __importDefault(require("../manager/RobotManager"));
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
            //如果在匹配房间内游戏还没开始，达到条件房间就解散(在线玩家为0)
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
    GameLinkInterface.do_player_login_logic_server = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, issuccess, room, oldPlayer, body, newPlayer, room, oldPlayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!player) return [3 /*break*/, 2];
                        Log_1["default"].info("player is exist, uid: ", utag, "is rotot: ", player.is_robot());
                        return [4 /*yield*/, player.init_session(session, utag, proto_type)];
                    case 1:
                        issuccess = _a.sent();
                        if (issuccess) {
                            room = roomMgr.get_room_by_uid(utag);
                            if (room) {
                                oldPlayer = room.get_player(utag);
                                if (oldPlayer) {
                                    player.set_player_info(oldPlayer.get_player_info());
                                }
                            }
                            player.send_cmd(GameHoodleProto_1.Cmd.eLoginLogicRes, { status: Response_1["default"].OK });
                        }
                        else {
                            player.send_cmd(GameHoodleProto_1.Cmd.eLoginLogicRes, { status: Response_1["default"].SYSTEM_ERR });
                        }
                        return [3 /*break*/, 7];
                    case 2:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        newPlayer = null;
                        if (!(body && body.isrobot == true)) return [3 /*break*/, 4];
                        return [4 /*yield*/, RobotManager_1["default"].getInstance().alloc_robot_player(session, utag, proto_type)];
                    case 3:
                        newPlayer = _a.sent();
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, playerMgr.alloc_player(session, utag, proto_type)];
                    case 5:
                        newPlayer = _a.sent();
                        _a.label = 6;
                    case 6:
                        Log_1["default"].info("hcc>> new player success!!! , isrobot: ", newPlayer.is_robot(), " ,uid:", newPlayer.get_uid());
                        if (newPlayer) {
                            room = roomMgr.get_room_by_uid(utag);
                            if (room) {
                                oldPlayer = room.get_player(utag);
                                if (oldPlayer) {
                                    newPlayer.set_player_info(oldPlayer.get_player_info());
                                }
                            }
                            newPlayer.send_cmd(GameHoodleProto_1.Cmd.eLoginLogicRes, { status: Response_1["default"].OK });
                        }
                        else {
                            GameSendMsg_1["default"].send(session, GameHoodleProto_1.Cmd.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return GameLinkInterface;
}());
exports["default"] = GameLinkInterface;
//# sourceMappingURL=GameLinkInterface.js.map