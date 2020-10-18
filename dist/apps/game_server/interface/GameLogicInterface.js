"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var RoomManager_1 = __importDefault(require("../manager/RoomManager"));
var playerMgr = PlayerManager_1["default"].getInstance();
var roomMgr = RoomManager_1["default"].getInstance();
var GameLogicInterface = /** @class */ (function () {
    function GameLogicInterface() {
    }
    return GameLogicInterface;
}());
exports["default"] = GameLogicInterface;
//# sourceMappingURL=GameLogicInterface.js.map