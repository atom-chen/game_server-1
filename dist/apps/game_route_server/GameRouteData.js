"use strict";
exports.__esModule = true;
//保存gateway session
var GameRouteData = /** @class */ (function () {
    function GameRouteData() {
    }
    GameRouteData.get_gateway_session = function () {
        return GameRouteData._gateway_session;
    };
    GameRouteData.set_gateway_session = function (session) {
        GameRouteData._gateway_session = session;
    };
    GameRouteData.set_logic_server_session = function (server_key, server_session) {
        GameRouteData._logic_server_session[server_key] = server_session;
    };
    GameRouteData.get_logic_server_session = function (server_key) {
        return GameRouteData._logic_server_session[server_key];
    };
    GameRouteData.delete_logic_server_session = function (server_key) {
        if (GameRouteData._logic_server_session[server_key]) {
            delete GameRouteData._logic_server_session[server_key];
        }
    };
    GameRouteData.get_all_logic_server_session = function () {
        return GameRouteData._logic_server_session;
    };
    GameRouteData._gateway_session = null;
    GameRouteData._logic_server_session = {};
    return GameRouteData;
}());
exports["default"] = GameRouteData;
//# sourceMappingURL=GameRouteData.js.map