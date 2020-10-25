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
var Response_1 = __importDefault(require("../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var GameSendMsg_1 = __importDefault(require("../GameSendMsg"));
var ProtoManager_1 = __importDefault(require("../../../netengine/ProtoManager"));
var RobotManager_1 = __importDefault(require("../manager/RobotManager"));
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var RedisLobby_1 = __importDefault(require("../../../database/RedisLobby"));
var GameServerData_1 = __importDefault(require("../GameServerData"));
var SendLogicInfo_1 = __importDefault(require("./SendLogicInfo"));
var playerMgr = PlayerManager_1["default"].getInstance();
var GameLinkInterface = /** @class */ (function () {
    function GameLinkInterface() {
    }
    GameLinkInterface._player_lost_connect = function (player) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!player) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, player.get_room()];
                    case 1:
                        room = _a.sent();
                        if (room) {
                            player.set_offline(true);
                            player.send_all(GameHoodleProto_1["default"].XY_ID.eUserOfflineRes, { seatid: player.get_seat_id() }, player.get_uid());
                            SendLogicInfo_1["default"].broadcast_player_info_in_rooom(room, player.get_uid());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //玩家断线
    GameLinkInterface.do_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        if (!player) {
            return;
        }
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (body && body.is_robot == true) { //机器人服务掉线，删掉所有机器人
            var robot_player_set = RobotManager_1["default"].getInstance().get_robot_player_set();
            for (var key in robot_player_set) {
                GameLinkInterface._player_lost_connect(robot_player_set[key]);
            }
            return;
        }
        if (player) {
            GameLinkInterface._player_lost_connect(player);
        }
    };
    //玩家登录逻辑服务
    GameLinkInterface.do_player_login_logic_server = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, issuccess, body, newPlayer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        if (!player) return [3 /*break*/, 2];
                        Log_1["default"].info("player is exist, uid: ", utag, "is rotot: ", player.is_robot(), "playerCount:", playerMgr.get_player_count());
                        return [4 /*yield*/, player.init_data(session, utag, proto_type)];
                    case 1:
                        issuccess = _a.sent();
                        if (issuccess) {
                            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].SUCCESS });
                            RedisLobby_1["default"].set_server_playercount(GameServerData_1["default"].get_server_key(), playerMgr.get_player_count());
                            return [2 /*return*/];
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
                        Log_1["default"].info("hcc>> new player success!!! , isrobot: ", newPlayer.is_robot(), " ,uid:", newPlayer.get_uid(), "playerCount:", playerMgr.get_player_count());
                        if (newPlayer) {
                            GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].SUCCESS });
                            RedisLobby_1["default"].set_server_playercount(GameServerData_1["default"].get_server_key(), playerMgr.get_player_count());
                            return [2 /*return*/];
                        }
                        _a.label = 7;
                    case 7:
                        GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eLoginLogicRes, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameLinkInterface;
}());
exports["default"] = GameLinkInterface;
//# sourceMappingURL=GameLinkInterface.js.map