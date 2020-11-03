"use strict";
var _a;
exports.__esModule = true;
var GameHoodleProto = /** @class */ (function () {
    function GameHoodleProto() {
    }
    GameHoodleProto.protoNameSpace = "GameHoodleProto"; //proto命名空间
    GameHoodleProto.protoFileName = "GameHoodleProtoMsg"; //编译出来后xxxProtoMsg.js的文件名，不用加.js
    GameHoodleProto.XY_ID = {
        INVALED: 0,
        ////////////////////////////////://
        //游戏通用协议
        ////////////////////////////////://
        eLoginLogicReq: 101,
        eLoginLogicRes: 102,
        eCheckLinkGameReq: 103,
        eCheckLinkGameRes: 104,
        eUserInfoRes: 105,
        eGameRuleRes: 106,
        eRoomIdRes: 107,
        ePlayCountRes: 108,
        eUserOfflineRes: 109,
        eUserEmojReq: 110,
        eUserEmojRes: 111,
        ////////////////////////////////://
        //游戏具体玩法相关
        ////////////////////////////////://
        eUserReadyReq: 112,
        eUserReadyRes: 113,
        eGameStartRes: 114,
        eGameResultRes: 115,
        eTotalGameResultRes: 116,
        ePlayerFirstBallPosRes: 117,
        ePlayerPowerRes: 118,
        ePlayerShootReq: 119,
        ePlayerShootRes: 120,
        ePlayerBallPosReq: 121,
        ePlayerBallPosRes: 122,
        ePlayerIsShootedReq: 123,
        ePlayerIsShootedRes: 124,
        ePlayerScoreRes: 125
    };
    GameHoodleProto.XY_NAME = (_a = {},
        ///////////////////////////////////
        //游戏通用协议
        ///////////////////////////////////
        _a[GameHoodleProto.XY_ID.eCheckLinkGameReq] = "CheckLinkGameReq",
        _a[GameHoodleProto.XY_ID.eCheckLinkGameRes] = "CheckLinkGameRes",
        _a[GameHoodleProto.XY_ID.eUserInfoRes] = "UserInfoRes",
        _a[GameHoodleProto.XY_ID.eGameRuleRes] = "GameRuleRes",
        _a[GameHoodleProto.XY_ID.eRoomIdRes] = "RoomIdRes",
        _a[GameHoodleProto.XY_ID.ePlayCountRes] = "PlayCountRes",
        _a[GameHoodleProto.XY_ID.eUserReadyReq] = "UserReadyReq",
        _a[GameHoodleProto.XY_ID.eUserReadyRes] = "UserReadyRes",
        _a[GameHoodleProto.XY_ID.eGameStartRes] = "GameStartRes",
        _a[GameHoodleProto.XY_ID.eLoginLogicReq] = "LoginLogicReq",
        _a[GameHoodleProto.XY_ID.eLoginLogicRes] = "LoginLogicRes",
        _a[GameHoodleProto.XY_ID.eUserOfflineRes] = "UserOfflineRes",
        _a[GameHoodleProto.XY_ID.eUserEmojReq] = "UserEmojReq",
        _a[GameHoodleProto.XY_ID.eUserEmojRes] = "UserEmojRes",
        ///////////////////////////////////
        //游戏具体玩法相关
        ///////////////////////////////////
        _a[GameHoodleProto.XY_ID.ePlayerFirstBallPosRes] = "PlayerFirstBallPosRes",
        _a[GameHoodleProto.XY_ID.ePlayerPowerRes] = "PlayerPowerRes",
        _a[GameHoodleProto.XY_ID.ePlayerShootReq] = "PlayerShootReq",
        _a[GameHoodleProto.XY_ID.ePlayerShootRes] = "PlayerShootRes",
        _a[GameHoodleProto.XY_ID.ePlayerBallPosReq] = "PlayerBallPosReq",
        _a[GameHoodleProto.XY_ID.ePlayerBallPosRes] = "PlayerBallPosRes",
        _a[GameHoodleProto.XY_ID.ePlayerIsShootedReq] = "PlayerIsShootedReq",
        _a[GameHoodleProto.XY_ID.ePlayerIsShootedRes] = "PlayerIsShootedRes",
        _a[GameHoodleProto.XY_ID.eGameResultRes] = "GameResultRes",
        _a[GameHoodleProto.XY_ID.eTotalGameResultRes] = "TotalGameResultRes",
        _a[GameHoodleProto.XY_ID.ePlayerScoreRes] = "PlayerScoreRes",
        _a);
    return GameHoodleProto;
}());
exports["default"] = GameHoodleProto;
//# sourceMappingURL=GameHoodleProto.js.map