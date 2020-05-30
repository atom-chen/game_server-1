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
var GameCheck_1 = __importDefault(require("./GameCheck"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GameEmojInterface = /** @class */ (function () {
    function GameEmojInterface() {
    }
    GameEmojInterface.do_player_use_emoj = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        if (!GameCheck_1["default"].check_room(utag)) {
            Log_1["default"].warn(player.get_unick(), "do_player_use_emoj room is not exist!");
            return;
        }
        var room = roomMgr.get_room_by_uid(player.get_uid());
        if (room) {
            var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
            var resObj = {
                seatid: player.get_seat_id(),
                emojconfig: body.emojconfig
            };
            var resBody = {
                status: Response_1["default"].OK,
                emojconfig: JSON.stringify(resObj)
            };
            room.broadcast_in_room(GameHoodleProto_1.Cmd.eUserEmojRes, resBody);
        }
    };
    return GameEmojInterface;
}());
exports["default"] = GameEmojInterface;
//# sourceMappingURL=GameEmojInterface.js.map