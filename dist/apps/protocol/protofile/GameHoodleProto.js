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
        // eCreateRoomReq: 1, 		//创建包厢
        // eCreateRoomRes: 2,
        // eJoinRoomReq: 3,		//加入包厢
        // eJoinRoomRes: 4,
        // eExitRoomReq: 5,		//退出包厢
        // eExitRoomRes: 6,
        // eDessolveReq: 7,		//解散包厢
        // eDessolveRes: 8,
        // eGetRoomStatusReq: 9,		//包厢状态
        // eGetRoomStatusRes: 10,
        // eBackRoomReq: 11,		//返回包厢
        // eBackRoomRes: 12,
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
        eUserEmojReq: 55,
        eUserEmojRes: 56,
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
        ePlayerScoreRes: 36
    };
    GameHoodleProto.XY_NAME = (_a = {},
        ///////////////////////////////////
        //房间相关协议
        ///////////////////////////////////
        // [GameHoodleProto.XY_ID.INVALED]: "INVALED",
        // [GameHoodleProto.XY_ID.eCreateRoomReq]: "CreateRoomReq", 			// 创建包厢
        // [GameHoodleProto.XY_ID.eCreateRoomRes]: "CreateRoomRes",
        // [GameHoodleProto.XY_ID.eJoinRoomReq]: "JoinRoomReq",				// 加入包厢
        // [GameHoodleProto.XY_ID.eJoinRoomRes]: "JoinRoomRes",
        // [GameHoodleProto.XY_ID.eExitRoomReq]: "ExitRoomReq",				// 退出包厢
        // [GameHoodleProto.XY_ID.eExitRoomRes]: "ExitRoomRes",
        // [GameHoodleProto.XY_ID.eDessolveReq]: "DessolveReq",				// 解散包厢
        // [GameHoodleProto.XY_ID.eDessolveRes]: "DessolveRes",
        // [GameHoodleProto.XY_ID.eGetRoomStatusReq]: "GetRoomStatusReq",		// 包厢状态
        // [GameHoodleProto.XY_ID.eGetRoomStatusRes]: "GetRoomStatusRes",
        // [GameHoodleProto.XY_ID.eBackRoomReq]: "BackRoomReq",			// 返回包厢
        // [GameHoodleProto.XY_ID.eBackRoomRes]: "BackRoomRes",
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
        _a[GameHoodleProto.XY_ID.eUserEmojReq] = "UserEmojReq",
        _a[GameHoodleProto.XY_ID.eUserEmojRes] = "UserEmojRes",
        _a);
    return GameHoodleProto;
}());
exports["default"] = GameHoodleProto;
//# sourceMappingURL=GameHoodleProto.js.map