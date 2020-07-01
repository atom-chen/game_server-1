"use strict";
exports.__esModule = true;
var AuthProto_1 = require("../protocol/AuthProto");
var Stype_1 = require("../protocol/Stype");
var LOGIN_OR_REGIST_ERQ_CMD = [
    AuthProto_1.Cmd.eUnameLoginReq,
    AuthProto_1.Cmd.eGuestLoginReq,
    AuthProto_1.Cmd.ePhoneRegistReq,
    AuthProto_1.Cmd.eUnameRegistReq,
    AuthProto_1.Cmd.eWeChatLoginReq,
    AuthProto_1.Cmd.eWeChatSessionLoginReq,
];
var LOGIN_OR_REGIST_ERS_CMD = [
    AuthProto_1.Cmd.eUnameLoginRes,
    AuthProto_1.Cmd.eGuestLoginRes,
    AuthProto_1.Cmd.eUnameRegistRes,
    AuthProto_1.Cmd.ePhoneRegistRes,
    AuthProto_1.Cmd.eWeChatLoginRes,
    AuthProto_1.Cmd.eWeChatSessionLoginRes,
];
var uid_session_map = {}; //保存已经登录过的玩家 uid-> session
var robot_session_map = {}; //机器人客户端session
var GatewayFunction = /** @class */ (function () {
    function GatewayFunction() {
    }
    //登录请求
    GatewayFunction.is_login_req_cmd = function (stype, ctype) {
        if (stype != Stype_1.Stype.Auth) {
            return false;
        }
        return (LOGIN_OR_REGIST_ERQ_CMD.indexOf(ctype) > -1);
    };
    //登录返回
    GatewayFunction.is_login_res_cmd = function (stype, ctype) {
        if (stype != Stype_1.Stype.Auth) {
            return false;
        }
        return (LOGIN_OR_REGIST_ERS_CMD.indexOf(ctype) > -1);
    };
    //返回登录过的玩家的UID
    GatewayFunction.get_session_by_uid = function (uid) {
        return uid_session_map[uid];
    };
    //保存登录过的玩家的 uid->session
    GatewayFunction.save_session_with_uid = function (uid, session, proto_type) {
        uid_session_map[uid] = session;
        session.proto_type = proto_type;
    };
    //清理session
    GatewayFunction.clear_session_with_uid = function (uid) {
        if (uid_session_map[uid]) {
            uid_session_map[uid] = null;
            delete uid_session_map[uid];
        }
    };
    //保存机器人session
    GatewayFunction.save_robot_session = function (session, uid) {
        robot_session_map[uid] = session;
    };
    //获取机器人session
    GatewayFunction.get_robot_session = function (uid) {
        return robot_session_map[uid];
    };
    //是否机器人session
    GatewayFunction.is_robot_session = function (session) {
        for (var key in robot_session_map) {
            if (robot_session_map[key] == session) {
                return true;
            }
        }
        return false;
    };
    //获取机器人session map
    GatewayFunction.get_robot_session_map = function () {
        return robot_session_map;
    };
    return GatewayFunction;
}());
exports["default"] = GatewayFunction;
//# sourceMappingURL=GatewayFunction.js.map