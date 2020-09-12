"use strict";
exports.__esModule = true;
var GameSessionMgr = /** @class */ (function () {
    function GameSessionMgr() {
    }
    GameSessionMgr.get_gateway_session = function () {
        return GameSessionMgr._gateway_session;
    };
    GameSessionMgr.set_gateway_session = function (session) {
        GameSessionMgr._gateway_session = session;
    };
    GameSessionMgr._gateway_session = null;
    return GameSessionMgr;
}());
exports["default"] = GameSessionMgr;
//# sourceMappingURL=GameSessionMgr.js.map