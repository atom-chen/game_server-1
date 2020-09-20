"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var RobotListConfig_1 = __importDefault(require("../config/RobotListConfig"));
var RobotSend_1 = __importDefault(require("../RobotSend"));
var AuthProto_1 = __importDefault(require("../../protocol/protofile/AuthProto"));
var RobotAuthIngerface = /** @class */ (function () {
    function RobotAuthIngerface() {
    }
    //登录auth服务
    RobotAuthIngerface.robot_login_auth_server = function (server_session) {
        for (var _utag in RobotListConfig_1["default"].robot_roomlevel_map) {
            var robot_obj = RobotListConfig_1["default"].robot_roomlevel_map[_utag];
            var utag = Number(_utag);
            var guest_key = robot_obj.guestkey;
            RobotSend_1["default"].send_auth(server_session, AuthProto_1["default"].XY_ID.REQ_GUESTLOGIN, utag, { guestkey: guest_key });
        }
    };
    return RobotAuthIngerface;
}());
exports["default"] = RobotAuthIngerface;
//# sourceMappingURL=RobotAuthIngerface.js.map