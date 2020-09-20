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
        ///////////////////////////////////
        //房间相关协议
        ///////////////////////////////////
        eCreateRoomReq: 1,
        eCreateRoomRes: 2,
        eJoinRoomReq: 3,
        eJoinRoomRes: 4,
        eExitRoomReq: 5,
        eExitRoomRes: 6,
        eDessolveReq: 7,
        eDessolveRes: 8,
        eGetRoomStatusReq: 9,
        eGetRoomStatusRes: 10,
        eBackRoomReq: 11,
        eBackRoomRes: 12,
        ////////////////////////////////://
        //游戏相关协议
        ////////////////////////////////://
        eCheckLinkGameReq: 13,
        eCheckLinkGameRes: 14,
        eUserInfoRes: 15,
        eGameRuleRes: 16,
        eRoomIdRes: 17,
        ePlayCountRes: 18,
        eUserReadyReq: 19,
        eUserReadyRes: 20,
        eGameStartRes: 21,
        eGameEndRes: 22,
        eLoginLogicReq: 23,
        eLoginLogicRes: 24,
        eUserOfflineRes: 25,
        ////////////////////////////////://
        //游戏具体玩法相关
        ////////////////////////////////://
        ePlayerFirstBallPosRes: 26,
        ePlayerPowerRes: 27,
        ePlayerShootReq: 28,
        ePlayerShootRes: 29,
        ePlayerBallPosReq: 30,
        ePlayerBallPosRes: 31,
        ePlayerIsShootedReq: 32,
        ePlayerIsShootedRes: 33,
        eGameResultRes: 34,
        eTotalGameResultRes: 35,
        ePlayerScoreRes: 36,
        eUserMatchReq: 37,
        eUserMatchRes: 38,
        eUserStopMatchReq: 39,
        eUserStopMatchRes: 40,
        eUserGameInfoReq: 41,
        eUserGameInfoRes: 42,
        eUserBallInfoReq: 43,
        eUserBallInfoRes: 44,
        eUpdateUserBallReq: 45,
        eUpdateUserBallRes: 46,
        eStoreListReq: 47,
        eStoreListRes: 48,
        eBuyThingsReq: 49,
        eBuyThingsRes: 50,
        eUseHoodleBallReq: 51,
        eUseHoodleBallRes: 52,
        eUserConfigReq: 53,
        eUserConfigRes: 54,
        eUserEmojReq: 55,
        eUserEmojRes: 56,
        eUserPlayAgainReq: 57,
        eUserPlayAgainRes: 58,
        eUserPlayAgainAnswerReq: 59,
        eUserPlayAgainAnswerRes: 60,
        eUserPlayAgainStartRes: 61,
        eRoomListConfigReq: 62,
        eRoomListConfigRes: 63
    };
    GameHoodleProto.XY_NAME = (_a = {},
        ///////////////////////////////////
        //房间相关协议
        ///////////////////////////////////
        _a[GameHoodleProto.XY_ID.INVALED] = "INVALED",
        _a[GameHoodleProto.XY_ID.eCreateRoomReq] = "CreateRoomReq",
        _a[GameHoodleProto.XY_ID.eCreateRoomRes] = "CreateRoomRes",
        _a[GameHoodleProto.XY_ID.eJoinRoomReq] = "JoinRoomReq",
        _a[GameHoodleProto.XY_ID.eJoinRoomRes] = "JoinRoomRes",
        _a[GameHoodleProto.XY_ID.eExitRoomReq] = "ExitRoomReq",
        _a[GameHoodleProto.XY_ID.eExitRoomRes] = "ExitRoomRes",
        _a[GameHoodleProto.XY_ID.eDessolveReq] = "DessolveReq",
        _a[GameHoodleProto.XY_ID.eDessolveRes] = "DessolveRes",
        _a[GameHoodleProto.XY_ID.eGetRoomStatusReq] = "GetRoomStatusReq",
        _a[GameHoodleProto.XY_ID.eGetRoomStatusRes] = "GetRoomStatusRes",
        _a[GameHoodleProto.XY_ID.eBackRoomReq] = "BackRoomReq",
        _a[GameHoodleProto.XY_ID.eBackRoomRes] = "BackRoomRes",
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
        _a[GameHoodleProto.XY_ID.eGameEndRes] = "GameEndRes",
        _a[GameHoodleProto.XY_ID.eLoginLogicReq] = "LoginLogicReq",
        _a[GameHoodleProto.XY_ID.eLoginLogicRes] = "LoginLogicRes",
        _a[GameHoodleProto.XY_ID.eUserOfflineRes] = "UserOfflineRes",
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
        _a[GameHoodleProto.XY_ID.eUserMatchReq] = "UserMatchReq",
        _a[GameHoodleProto.XY_ID.eUserMatchRes] = "UserMatchRes",
        _a[GameHoodleProto.XY_ID.eUserStopMatchReq] = "UserStopMatchReq",
        _a[GameHoodleProto.XY_ID.eUserStopMatchRes] = "UserStopMatchRes",
        _a[GameHoodleProto.XY_ID.eUserGameInfoReq] = "UserGameInfoReq",
        _a[GameHoodleProto.XY_ID.eUserGameInfoRes] = "UserGameInfoRes",
        _a[GameHoodleProto.XY_ID.eUserBallInfoReq] = "UserBallInfoReq",
        _a[GameHoodleProto.XY_ID.eUserBallInfoRes] = "UserBallInfoRes",
        _a[GameHoodleProto.XY_ID.eUpdateUserBallReq] = "UpdateUserBallReq",
        _a[GameHoodleProto.XY_ID.eUpdateUserBallRes] = "UpdateUserBallRes",
        _a[GameHoodleProto.XY_ID.eStoreListReq] = "StoreListReq",
        _a[GameHoodleProto.XY_ID.eStoreListRes] = "StoreListRes",
        _a[GameHoodleProto.XY_ID.eBuyThingsReq] = "BuyThingsReq",
        _a[GameHoodleProto.XY_ID.eBuyThingsRes] = "BuyThingsRes",
        _a[GameHoodleProto.XY_ID.eUseHoodleBallReq] = "UseHoodleBallReq",
        _a[GameHoodleProto.XY_ID.eUseHoodleBallRes] = "UseHoodleBallRes",
        _a[GameHoodleProto.XY_ID.eUserConfigReq] = "UserConfigReq",
        _a[GameHoodleProto.XY_ID.eUserConfigRes] = "UserConfigRes",
        _a[GameHoodleProto.XY_ID.eUserEmojReq] = "UserEmojReq",
        _a[GameHoodleProto.XY_ID.eUserEmojRes] = "UserEmojRes",
        _a[GameHoodleProto.XY_ID.eUserPlayAgainReq] = "UserPlayAgainReq",
        _a[GameHoodleProto.XY_ID.eUserPlayAgainRes] = "UserPlayAgainRes",
        _a[GameHoodleProto.XY_ID.eUserPlayAgainAnswerReq] = "UserPlayAgainAnswerReq",
        _a[GameHoodleProto.XY_ID.eUserPlayAgainAnswerRes] = "UserPlayAgainAnswerRes",
        _a[GameHoodleProto.XY_ID.eUserPlayAgainStartRes] = "UserPlayAgainStartRes",
        _a[GameHoodleProto.XY_ID.eRoomListConfigReq] = "RoomListConfigReq",
        _a[GameHoodleProto.XY_ID.eRoomListConfigRes] = "RoomListConfigRes",
        _a);
    return GameHoodleProto;
}());
exports["default"] = GameHoodleProto;
//# sourceMappingURL=GameHoodleProto.js.map