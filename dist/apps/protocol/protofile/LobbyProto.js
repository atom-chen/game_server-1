"use strict";
var _a;
exports.__esModule = true;
var LobbyProto = /** @class */ (function () {
    function LobbyProto() {
    }
    LobbyProto.protoNameSpace = "lobby.client.proto"; //proto命名空间
    LobbyProto.protoFileName = "LobbyProtoMsg"; //编译出来后xxxProtoMsg.js的文件名，不用加.js
    LobbyProto.XY_ID = {
        INVALED: 0,
        REQ_LOGINLOBBY: 20001,
        RESP_LOBINLOBBY: 20002
    };
    LobbyProto.XY_NAME = (_a = {},
        _a[LobbyProto.XY_ID.REQ_LOGINLOBBY] = "reqLoginLobby",
        _a[LobbyProto.XY_ID.RESP_LOBINLOBBY] = "resLoginLobby",
        _a);
    return LobbyProto;
}());
exports["default"] = LobbyProto;
//# sourceMappingURL=LobbyProto.js.map