"use strict";
exports.__esModule = true;
//保存gateway session
var GameRouteSaveSession = /** @class */ (function () {
    function GameRouteSaveSession() {
    }
    GameRouteSaveSession.get_gateway_session = function () {
        return GameRouteSaveSession._gateway_session;
    };
    GameRouteSaveSession.set_gateway_session = function (session) {
        GameRouteSaveSession._gateway_session = session;
    };
    GameRouteSaveSession._gateway_session = null;
    return GameRouteSaveSession;
}());
exports["default"] = GameRouteSaveSession;
//# sourceMappingURL=GameRouteSaveSession.js.map