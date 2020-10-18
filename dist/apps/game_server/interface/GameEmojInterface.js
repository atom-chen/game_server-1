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
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var GameCheck_1 = __importDefault(require("./GameCheck"));
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var GameSendMsg_1 = __importDefault(require("../GameSendMsg"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GameEmojInterface = /** @class */ (function () {
    function GameEmojInterface() {
    }
    GameEmojInterface.do_player_use_emoj = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, body, resObj, resBody;
            return __generator(this, function (_a) {
                if (!GameCheck_1["default"].check_player(utag)) {
                    GameSendMsg_1["default"].send(session, GameHoodleProto_1["default"].XY_ID.eUserEmojRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                    Log_1["default"].warn("on_player_use_emoj error player is not exist!");
                    return [2 /*return*/];
                }
                player = playerMgr.get_player(utag);
                if (player) {
                    body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                    resObj = {
                        seatid: player.get_seat_id(),
                        emojconfig: body.emojconfig
                    };
                    resBody = {
                        status: Response_1["default"].OK,
                        emojconfig: JSON.stringify(resObj)
                    };
                    player.send_all(GameHoodleProto_1["default"].XY_ID.eUserEmojRes, resBody);
                }
                return [2 /*return*/];
            });
        });
    };
    return GameEmojInterface;
}());
exports["default"] = GameEmojInterface;
//# sourceMappingURL=GameEmojInterface.js.map