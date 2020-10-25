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
var Log_1 = __importDefault(require("../../../utils/Log"));
var GameInfoHandle_1 = __importDefault(require("./GameInfoHandle"));
var LobbySendMsg_1 = __importDefault(require("../LobbySendMsg"));
var LobbyProto_1 = __importDefault(require("../../protocol/protofile/LobbyProto"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var RedisLobby_1 = __importDefault(require("../../../database/RedisLobby"));
var ProtoManager_1 = __importDefault(require("../../../netengine/ProtoManager"));
var RedisEvent_1 = __importDefault(require("../../../database/RedisEvent"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var State_1 = __importDefault(require("../../config/State"));
var RoomHandle = /** @class */ (function () {
    function RoomHandle() {
    }
    RoomHandle.get_roominfo_obj_by_uid = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            var roominfo, roominfoObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_uid(utag)];
                    case 1:
                        roominfo = _a.sent();
                        roominfoObj = null;
                        if (roominfo) {
                            try {
                                roominfoObj = JSON.parse(roominfo);
                            }
                            catch (error) {
                                Log_1["default"].error("hcc>>ger_roominfo_by_uid", error);
                            }
                        }
                        return [2 /*return*/, roominfoObj];
                }
            });
        });
    };
    RoomHandle.check_gamerule = function (gamerule_str) {
        if (!gamerule_str || gamerule_str == "") {
            return false;
        }
        var gamerule_obj = null;
        try {
            gamerule_obj = JSON.parse(gamerule_str);
        }
        catch (error) {
            Log_1["default"].error("check_game_rule:", error);
            return false;
        }
        if (!gamerule_obj) {
            return false;
        }
        var playCount = gamerule_obj.playCount; //局数
        var playerCount = gamerule_obj.playerCount; //人数
        if (!playCount || !playerCount) {
            return false;
        }
        return true;
    };
    RoomHandle.get_gameinfo_obj = function (gameinfo_str) {
        if (!gameinfo_str) {
            return null;
        }
        var gameinfo_obj = null;
        try {
            gameinfo_obj = JSON.parse(gameinfo_str);
        }
        catch (error) {
            Log_1["default"].error("get_gameinfo_obj", error);
        }
        return gameinfo_obj;
    };
    RoomHandle.get_gamerule_obj = function (gamerule_str) {
        if (!gamerule_str) {
            return null;
        }
        var gamerule_obj = null;
        try {
            gamerule_obj = JSON.parse(gamerule_str);
        }
        catch (error) {
            Log_1["default"].error("get_gamerule_obj", error);
        }
        return gamerule_obj;
    };
    RoomHandle.do_req_create_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, isExist, roomid, decode_body, game_server_key, gamerule, rulecheck, roominfo_obj, room_info_json, ret, ret2, msg, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        isExist = _a.sent();
                        if (isExist) { //玩家已经在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].generate_roomid()];
                    case 3:
                        roomid = _a.sent();
                        if (!roomid) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_3 });
                            return [2 /*return*/];
                        }
                        decode_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!decode_body) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_4 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].choose_game_server()];
                    case 4:
                        game_server_key = _a.sent();
                        if (!game_server_key || game_server_key < 0) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_5 });
                            Log_1["default"].error("game_server is full of players!!");
                            return [2 /*return*/];
                        }
                        gamerule = decode_body.gamerule;
                        rulecheck = RoomHandle.check_gamerule(gamerule);
                        if (!rulecheck) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_6 });
                            return [2 /*return*/];
                        }
                        roominfo_obj = {
                            roomid: roomid,
                            uids: [utag],
                            game_serverid: game_server_key,
                            game_state: State_1["default"].GameState.InView,
                            gamerule: gamerule
                        };
                        Log_1["default"].info("hcc>>createroominfo: ", roominfo_obj);
                        room_info_json = "";
                        try {
                            room_info_json = JSON.stringify(roominfo_obj);
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                            return [2 /*return*/];
                        }
                        if (!room_info_json || room_info_json == "") {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].ERROR_7 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].save_uid_roominfo_inredis(utag, room_info_json)];
                    case 5:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 7];
                        return [4 /*yield*/, RedisLobby_1["default"].save_roomid_roominfo_inredis(roomid, room_info_json)];
                    case 6:
                        ret2 = _a.sent();
                        if (ret2) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SUCCESS });
                            msg = {
                                xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.create_room,
                                uid: utag
                            };
                            body = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj);
                            RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body));
                        }
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_join_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, body, roomid, roominfo_str, uidIsExist, roominfo_obj, game_state, gamerule_obj, uids, maxplayer, ret, roominfo_obj_ex, msg, body_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        roomid = body.roomid;
                        if (!roomid || roomid == "") {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_roomid(roomid)];
                    case 2:
                        roominfo_str = _a.sent();
                        if (!roominfo_str) { //房间不存在
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_3 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 3:
                        uidIsExist = _a.sent();
                        if (uidIsExist) { //玩家已经在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_4 });
                            return [2 /*return*/];
                        }
                        roominfo_obj = RoomHandle.get_gameinfo_obj(roominfo_str);
                        if (!roominfo_obj) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_5 });
                            return [2 /*return*/];
                        }
                        game_state = roominfo_obj.game_state;
                        if (!game_state || (game_state && (game_state == State_1["default"].GameState.Gameing || game_state == State_1["default"].GameState.CheckOut))) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_6 });
                            return [2 /*return*/];
                        }
                        gamerule_obj = RoomHandle.get_gamerule_obj(roominfo_obj.gamerule);
                        if (!gamerule_obj) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_7 });
                            return [2 /*return*/];
                        }
                        uids = roominfo_obj.uids;
                        maxplayer = gamerule_obj.playerCount;
                        if (!uids || !maxplayer) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_8 });
                            return [2 /*return*/];
                        }
                        if (uids.length >= maxplayer) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].ERROR_9 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].add_uid_in_roominfo(roomid, utag)];
                    case 4:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 6];
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].SUCCESS });
                        return [4 /*yield*/, RoomHandle.get_roominfo_obj_by_uid(utag)];
                    case 5:
                        roominfo_obj_ex = _a.sent();
                        if (roominfo_obj_ex) {
                            msg = {
                                xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.join_room,
                                uid: utag
                            };
                            body_1 = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj_ex);
                            RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body_1));
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_exit_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist, roominfo_obj, game_state, roomid, game_serverid, ret, roominfo_str, msg, roominfo_obj_ex, body, msg, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RoomHandle.get_roominfo_obj_by_uid(utag)];
                    case 3:
                        roominfo_obj = _a.sent();
                        if (!roominfo_obj) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].ERROR_3 });
                            return [2 /*return*/];
                        }
                        game_state = roominfo_obj.game_state;
                        if (!game_state || (game_state && (game_state == State_1["default"].GameState.Gameing || game_state == State_1["default"].GameState.CheckOut))) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].ERROR_4 });
                            return [2 /*return*/];
                        }
                        roomid = roominfo_obj.roomid || "";
                        game_serverid = roominfo_obj.game_serverid || 0;
                        return [4 /*yield*/, RedisLobby_1["default"].delete_uid_in_roominfo(roomid, utag)];
                    case 4:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 6];
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].SUCCESS });
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_roomid(roomid)];
                    case 5:
                        roominfo_str = _a.sent();
                        if (roominfo_str) {
                            // 没解散
                            if (game_serverid) {
                                msg = {
                                    xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.exit_room,
                                    uid: utag
                                };
                                roominfo_obj_ex = JSON.parse(roominfo_str);
                                if (roominfo_obj_ex) {
                                    body = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj_ex);
                                    RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body));
                                }
                            }
                        }
                        else {
                            // 已经解散
                            if (game_serverid) {
                                msg = {
                                    xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.exit_room,
                                    uid: utag
                                };
                                roominfo_obj.uids = [];
                                body = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj);
                                RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body));
                            }
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_dessolve_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist, roominfo_obj, roomid, ret, msg, body, uids;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RoomHandle.get_roominfo_obj_by_uid(utag)];
                    case 3:
                        roominfo_obj = _a.sent();
                        if (!roominfo_obj) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].ERROR_3 });
                            return [2 /*return*/];
                        }
                        roomid = roominfo_obj.roomid || "";
                        return [4 /*yield*/, RedisLobby_1["default"].delete_room(roomid)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].SUCCESS });
                            msg = {
                                xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.dessolve_room,
                                uid: utag
                            };
                            body = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj);
                            RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body));
                        }
                        uids = roominfo_obj.uids;
                        if (uids) {
                            uids.forEach(function (tmpUid) {
                                if (tmpUid != utag) {
                                    LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, tmpUid, proto_type, { status: Response_1["default"].SUCCESS });
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_back_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist, roominfo_obj, msg, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RoomHandle.get_roominfo_obj_by_uid(utag)];
                    case 3:
                        roominfo_obj = _a.sent();
                        if (!roominfo_obj) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].ERROR_3 });
                            return [2 /*return*/];
                        }
                        msg = {
                            xy_name: RedisEvent_1["default"].redis_lobby_channel_msg.back_room,
                            uid: utag
                        };
                        body = ArrayUtil_1["default"].ObjCat(msg, roominfo_obj);
                        RedisEvent_1["default"].publish_msg(RedisEvent_1["default"].channel_name.lobby_channel, JSON.stringify(body));
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].SUCCESS });
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_room_status = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                            return [2 /*return*/];
                        }
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].SUCCESS });
                        return [2 /*return*/];
                }
            });
        });
    };
    return RoomHandle;
}());
exports["default"] = RoomHandle;
//# sourceMappingURL=RoomHandle.js.map