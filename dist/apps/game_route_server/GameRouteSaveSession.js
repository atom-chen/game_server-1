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
//test
// GameRouteSaveSession.set_logic_server_session(1, "123")
// GameRouteSaveSession.set_logic_server_session(2, "2222")
// GameRouteSaveSession.set_logic_server_session(3, "3333")
// GameRouteSaveSession.set_logic_server_session(6, "67")
// GameRouteSaveSession.set_logic_server_session(100,"10000")
// let all_serssion = GameRouteSaveSession.get_all_logic_server_session()
// Log.info("all_serssion: ", all_serssion);
//# sourceMappingURL=GameRouteSaveSession.js.map