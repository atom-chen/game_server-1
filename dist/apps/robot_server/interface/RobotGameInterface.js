"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var RobotSend_1 = __importDefault(require("../RobotSend"));
var GameHoodleProto_1 = require("../../protocol/GameHoodleProto");
var RobotListConfig_1 = __importDefault(require("../config/RobotListConfig"));
var util = __importStar(require("util"));
var StringUtil_1 = __importDefault(require("../../../utils/StringUtil"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var RobotGameInterface = /** @class */ (function () {
    function RobotGameInterface() {
    }
    //登录逻辑服务
    RobotGameInterface.robot_login_logic_server = function (server_session, utag) {
        RobotSend_1["default"].send_game(server_session, GameHoodleProto_1.Cmd.eLoginLogicReq, utag, { isrobot: true });
    };
    //去对应等级房间匹配
    RobotGameInterface.go_to_match_game = function (server_session, utag) {
        for (var _utag in RobotListConfig_1["default"].robot_roomlevel_map) {
            var robot_obj = RobotListConfig_1["default"].robot_roomlevel_map[_utag];
            var utagtmp = Number(_utag);
            var room_level = robot_obj.roomlevel;
            if (utagtmp == utag) {
                RobotSend_1["default"].send_game(server_session, GameHoodleProto_1.Cmd.eUserMatchReq, utag, { roomlevel: room_level });
                break;
            }
        }
    };
    //不定时发送表情
    RobotGameInterface.send_emoj_random_timeout = function (server_session, utag, time_out) {
        if (util.isNullOrUndefined(time_out)) {
            time_out = 0;
        }
        setTimeout(function () {
            RobotGameInterface.send_emoj_random(server_session, utag);
        }, time_out);
    };
    //发送随机表情 50%概率发送
    RobotGameInterface.send_emoj_random = function (server_session, utag) {
        var random_num = StringUtil_1["default"].random_int(1, 10);
        Log_1["default"].info("is show emoj: ", random_num, random_num <= 5);
        if (random_num <= 5) {
            var emojIndex = StringUtil_1["default"].random_int(1, RobotListConfig_1["default"].TOTAL_EMOJ_COUNT);
            var body = { emojconfig: String(emojIndex) };
            RobotSend_1["default"].send_game(server_session, GameHoodleProto_1.Cmd.eUserEmojReq, utag, body);
        }
    };
    return RobotGameInterface;
}());
exports["default"] = RobotGameInterface;
//# sourceMappingURL=RobotGameInterface.js.map