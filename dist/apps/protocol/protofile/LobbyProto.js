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
        RES_LOBINLOBBY: 20002,
        REQ_CERATEROOM: 20003,
        RES_CERATEROOM: 20004,
        REQ_JOINROOM: 20005,
        RES_JOINROOM: 20006,
        REQ_EXITROOM: 20007,
        RES_EXITROOM: 20008,
        REQ_BACKROOM: 20009,
        RES_BACKROOM: 20010,
        REQ_DESSOLVEROOM: 20011,
        RES_DESSOLVEROOM: 20012,
        REQ_ROOMSTATUS: 20013,
        RES_ROOMSTATUS: 20014,
        REQ_GAMEINFO: 20015,
        RES_GAMEINFO: 20016
    };
    LobbyProto.XY_NAME = (_a = {},
        _a[LobbyProto.XY_ID.REQ_LOGINLOBBY] = "ReqLoginLobby",
        _a[LobbyProto.XY_ID.RES_LOBINLOBBY] = "ResLoginLobby",
        _a[LobbyProto.XY_ID.REQ_CERATEROOM] = "ReqCreateRoom",
        _a[LobbyProto.XY_ID.RES_CERATEROOM] = "ResCreateRoom",
        _a[LobbyProto.XY_ID.REQ_JOINROOM] = "ReqJoinRoom",
        _a[LobbyProto.XY_ID.RES_JOINROOM] = "ResJoinRoom",
        _a[LobbyProto.XY_ID.REQ_EXITROOM] = "ReqExitRoom",
        _a[LobbyProto.XY_ID.RES_EXITROOM] = "ResExitRoom",
        _a[LobbyProto.XY_ID.REQ_BACKROOM] = "ReqBackRoom",
        _a[LobbyProto.XY_ID.RES_BACKROOM] = "ResBackRoom",
        _a[LobbyProto.XY_ID.REQ_DESSOLVEROOM] = "ReqDessolveRoom",
        _a[LobbyProto.XY_ID.RES_DESSOLVEROOM] = "ResDessolveRoom",
        _a[LobbyProto.XY_ID.REQ_ROOMSTATUS] = "ReqRoomStatus",
        _a[LobbyProto.XY_ID.RES_ROOMSTATUS] = "ResRoomStatus",
        _a[LobbyProto.XY_ID.REQ_GAMEINFO] = "ReqGameInfo",
        _a[LobbyProto.XY_ID.RES_GAMEINFO] = "ResGameInfo",
        _a);
    return LobbyProto;
}());
exports["default"] = LobbyProto;
//# sourceMappingURL=LobbyProto.js.map