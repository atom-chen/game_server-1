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
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var RoomHandle = /** @class */ (function () {
    function RoomHandle() {
    }
    RoomHandle.do_req_create_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, isExist, roomid, decode_body, room_info_obj, room_info_json, ret, ret2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        isExist = _a.sent();
                        if (isExist) { //玩家已经在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].generate_roomid()];
                    case 3:
                        roomid = _a.sent();
                        if (!roomid) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        decode_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!decode_body) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        room_info_obj = {
                            roomid: roomid,
                            uids: [utag],
                            game_serverid: RedisLobby_1["default"].choose_game_server(),
                            gamerule: decode_body.gamerule || ""
                        };
                        room_info_json = "";
                        try {
                            room_info_json = JSON.stringify(room_info_obj);
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                            return [2 /*return*/];
                        }
                        if (room_info_json == "") {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].save_uid_roominfo_inredis(utag, room_info_json)];
                    case 4:
                        ret = _a.sent();
                        if (!ret) return [3 /*break*/, 6];
                        return [4 /*yield*/, RedisLobby_1["default"].save_roomid_roominfo_inredis(roomid, room_info_json)];
                    case 5:
                        ret2 = _a.sent();
                        if (ret2) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response_1["default"].OK });
                        }
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_join_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, body, roomid, roomidIsExist, uidIsExist, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        roomid = body.roomid;
                        if (!roomid || roomid == "") {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].roomid_is_exist(roomid)];
                    case 2:
                        roomidIsExist = _a.sent();
                        if (!roomidIsExist) { //房间不存在
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 3:
                        uidIsExist = _a.sent();
                        if (uidIsExist) { //玩家已经在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].add_uid_in_roominfo(roomid, utag)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_JOINROOM, utag, proto_type, { status: Response_1["default"].OK });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_exit_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist, roominfo_json, roomid, roominfo_obj, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].OK });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].OK });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_uid(utag)];
                    case 3:
                        roominfo_json = _a.sent();
                        roomid = "";
                        try {
                            roominfo_obj = JSON.parse(roominfo_json);
                            if (roominfo_obj) {
                                roomid = roominfo_obj.roomid;
                            }
                        }
                        catch (error) {
                            Log_1["default"].error(error);
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].OK });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].delete_uid_in_roominfo(roomid, utag)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_EXITROOM, utag, proto_type, { status: Response_1["default"].OK });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_dessolve_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist, roominfo_json, roomid, roominfo_obj, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_uid(utag)];
                    case 3:
                        roominfo_json = _a.sent();
                        roomid = "";
                        try {
                            roominfo_obj = JSON.parse(roominfo_json);
                            if (roominfo_obj) {
                                roomid = roominfo_obj.roomid;
                            }
                        }
                        catch (error) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            Log_1["default"].error(error);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].delete_room(roomid)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response_1["default"].OK });
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RoomHandle.do_req_back_room = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var game_info, uidIsExist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, GameInfoHandle_1["default"].do_get_ugame_info(utag)];
                    case 1:
                        game_info = _a.sent();
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_BACKROOM, utag, proto_type, { status: Response_1["default"].OK });
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
                        Log_1["default"].info("hcc>>game_info", game_info); //玩家信息不存在
                        if (!game_info) {
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, RedisLobby_1["default"].uid_is_exist_in_room(utag)];
                    case 2:
                        uidIsExist = _a.sent();
                        if (!uidIsExist) { //玩家不在房间
                            LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].SYSTEM_ERR });
                            return [2 /*return*/];
                        }
                        LobbySendMsg_1["default"].send(session, LobbyProto_1["default"].XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response_1["default"].OK });
                        return [2 /*return*/];
                }
            });
        });
    };
    return RoomHandle;
}());
exports["default"] = RoomHandle;
//# sourceMappingURL=RoomHandle.js.map