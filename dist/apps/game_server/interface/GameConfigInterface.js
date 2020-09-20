"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Response_1 = __importDefault(require("../../protocol/Response"));
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var RoomListConfig_1 = require("../config/RoomListConfig");
var GameHoodleProto_1 = __importDefault(require("../../protocol/protofile/GameHoodleProto"));
var playerMgr = PlayerManager_1["default"].getInstance();
var GameConfigInterface = /** @class */ (function () {
    function GameConfigInterface() {
    }
    GameConfigInterface.do_player_room_list_req = function (utag, proto_type, raw_cmd) {
        var player = playerMgr.get_player(utag);
        var config = JSON.stringify(RoomListConfig_1.RoomListConfig);
        var body = {
            status: Response_1["default"].OK,
            config: config
        };
        // Log.info("hcc>>do_player_room_list_req: " , body);
        player.send_cmd(GameHoodleProto_1["default"].XY_ID.eRoomListConfigRes, body);
    };
    return GameConfigInterface;
}());
exports["default"] = GameConfigInterface;
//# sourceMappingURL=GameConfigInterface.js.map