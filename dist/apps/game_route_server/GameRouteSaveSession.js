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
    GameRouteSaveSession.set_logic_server_session = function (server_index, server_session) {
        GameRouteSaveSession._logic_server_session[server_index] = server_session;
    };
    GameRouteSaveSession.get_logic_server_session = function (server_index) {
        return GameRouteSaveSession._logic_server_session[server_index];
    };
    GameRouteSaveSession.get_all_logic_server_session = function () {
        return GameRouteSaveSession._logic_server_session;
    };
    GameRouteSaveSession._gateway_session = null;
    GameRouteSaveSession._logic_server_session = [];
    return GameRouteSaveSession;
}());
exports["default"] = GameRouteSaveSession;
//# sourceMappingURL=GameRouteSaveSession.js.map