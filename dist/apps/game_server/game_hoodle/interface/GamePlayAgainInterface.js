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
var GameCheck_1 = __importDefault(require("./GameCheck"));
var RoomManager_1 = __importDefault(require("../RoomManager"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GamePlayAgainInterface = /** @class */ (function () {
    function GamePlayAgainInterface() {
    }
    GamePlayAgainInterface.do_player_play_again_req = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        if (!GameCheck_1["default"].check_room(utag)) {
            Log_1["default"].warn(player.get_unick(), "do_player_play_again_req room is not exist!");
            return;
        }
        var room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            var resBody = {
                status: Response_1["default"].OK,
                ansconfig: player.get_unick()
            };
            player.send_cmd(GameHoodleProto_1.Cmd.eUserPlayAgainRes, { status: Response_1["default"].OK });
            room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserPlayAgainAnswerRes, resBody, player);
        }
    };
    GamePlayAgainInterface.do_player_play_again_answer = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        if (!GameCheck_1["default"].check_room(utag)) {
            Log_1["default"].warn(player.get_unick(), "do_player_play_again_answer room is not exist!");
            return;
        }
        var room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
            var responsecode = body.responsecode;
            var resBody = {
                status: Response_1["default"].OK,
                responsecode: responsecode
            };
            room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserPlayAgainRes, resBody, player);
        }
    };
    return GamePlayAgainInterface;
}());
exports["default"] = GamePlayAgainInterface;
//# sourceMappingURL=GamePlayAgainInterface.js.map