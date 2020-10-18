"use strict";
exports.__esModule = true;
var GameServerData = /** @class */ (function () {
    function GameServerData() {
    }
    GameServerData.get_server_key = function () {
        return GameServerData._server_key;
    };
    GameServerData.set_server_key = function (server_key) {
        GameServerData._server_key = server_key;
    };
    GameServerData._server_key = null;
    return GameServerData;
}());
exports["default"] = GameServerData;
//# sourceMappingURL=GameServerData.js.map