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
var RobotInterface = /** @class */ (function () {
    function RobotInterface() {
    }
    //登录逻辑服务
    RobotInterface.robot_login_logic_server = function () {
        var robot_roomlevel_map = RobotListConfig_1["default"].robot_roomlevel_map;
        var body = { isrobot: true };
        for (var key in robot_roomlevel_map) {
            var robot_uid_list = robot_roomlevel_map[key];
            robot_uid_list.forEach(function (uid) {
                RobotSend_1["default"].send_game(GameHoodleProto_1.Cmd.eLoginLogicReq, uid, body);
            });
        }
    };
    //去对应等级房间匹配
    RobotInterface.go_to_match_game = function (utag) {
        var robot_roomlevel_map = RobotListConfig_1["default"].robot_roomlevel_map;
        for (var key in robot_roomlevel_map) {
            var robot_uid_list = robot_roomlevel_map[key];
            if (robot_uid_list) {
                var ret = robot_uid_list.indexOf(utag);
                if (!util.isNullOrUndefined(ret)) {
                    var body = { roomlevel: Number(key) };
                    RobotSend_1["default"].send_game(GameHoodleProto_1.Cmd.eUserMatchReq, utag, body);
                    break;
                }
            }
        }
    };
    //不定时发送表情
    RobotInterface.send_emoj_random_timeout = function (utag, time_out) {
        if (util.isNullOrUndefined(time_out)) {
            time_out = 0;
        }
        setTimeout(function () {
            RobotInterface.send_emoj_random(utag);
        }, time_out);
    };
    //发送随机表情 50%概率发送
    RobotInterface.send_emoj_random = function (utag) {
        var random_num = StringUtil_1["default"].random_int(1, 10);
        Log_1["default"].info("is show emoj: ", random_num, random_num <= 5);
        if (random_num <= 5) {
            var emojIndex = StringUtil_1["default"].random_int(1, RobotListConfig_1["default"].TOTAL_EMOJ_COUNT);
            var body = { emojconfig: String(emojIndex) };
            RobotSend_1["default"].send_game(GameHoodleProto_1.Cmd.eUserEmojReq, utag, body);
        }
    };
    return RobotInterface;
}());
exports["default"] = RobotInterface;
//# sourceMappingURL=RobotInterface.js.map