"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var MatchManager_1 = __importDefault(require("../manager/MatchManager"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var matchMgr = MatchManager_1["default"].getInstance();
var GameMatchInterface = /** @class */ (function () {
    function GameMatchInterface() {
    }
    return GameMatchInterface;
}());
exports["default"] = GameMatchInterface;
//# sourceMappingURL=GameMatchInterface.js.map