"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
exports.__esModule = true;
var Stype_1 = __importDefault(require("../protocol/Stype"));
var AuthProto_1 = __importDefault(require("../protocol/protofile/AuthProto"));
var LOGIN_OR_REGIST_ERQ_CMD = (_a = {},
    _a[AuthProto_1["default"].XY_ID.REQ_UNAMELOGIN] = true,
    _a[AuthProto_1["default"].XY_ID.REQ_GUESTLOGIN] = true,
    _a[AuthProto_1["default"].XY_ID.REQ_UNAMEREGIST] = true,
    _a[AuthProto_1["default"].XY_ID.REQ_WECHATLOGIN] = true,
    _a[AuthProto_1["default"].XY_ID.REQ_WECHATSESSIONLOGIN] = true,
    _a);
var LOGIN_OR_REGIST_ERS_CMD = (_b = {},
    _b[AuthProto_1["default"].XY_ID.RES_UNAMELOGIN] = true,
    _b[AuthProto_1["default"].XY_ID.RES_GUESTLOGIN] = true,
    _b[AuthProto_1["default"].XY_ID.RES_UNAMEREGIST] = true,
    _b[AuthProto_1["default"].XY_ID.RES_WECHATLOGIN] = true,
    _b[AuthProto_1["default"].XY_ID.RES_WECHATSESSIONLOGIN] = true,
    _b);
var uid_session_map = {}; //保存已经登录过的玩家 uid-> session
var server_session_map = {}; //当前连接的服务器session
var GatewayFunction = /** @class */ (function () {
    function GatewayFunction() {
    }
    //是否登录请求
    GatewayFunction.is_login_req_cmd = function (stype, ctype) {
        if (stype != Stype_1["default"].S_TYPE.Auth) {
            return false;
        }
        return LOGIN_OR_REGIST_ERQ_CMD[ctype] === true;
    };
    //是否登录返回
    GatewayFunction.is_login_res_cmd = function (stype, ctype) {
        if (stype != Stype_1["default"].S_TYPE.Auth) {
            return false;
        }
        return LOGIN_OR_REGIST_ERS_CMD[ctype] === true;
    };
    /////////////////////////////
    //客户端session
    /////////////////////////////
    //保存登录过的玩家的 uid->session
    GatewayFunction.save_client_session_with_uid = function (uid, session, proto_type) {
        uid_session_map[uid] = session;
        session.proto_type = proto_type;
    };
    //返回登录过的玩家的UID
    GatewayFunction.get_client_session_by_uid = function (uid) {
        return uid_session_map[uid];
    };
    //清理session
    GatewayFunction.clear_client_session_with_uid = function (uid) {
        if (uid_session_map[uid]) {
            delete uid_session_map[uid];
        }
    };
    /////////////////////////////
    //服务session
    /////////////////////////////
    //保存当前所连接的服务session
    GatewayFunction.save_server_session = function (server_session, stype) {
        server_session_map[stype] = server_session;
    };
    //获取服务session
    GatewayFunction.get_server_session = function (stype) {
        return server_session_map[stype];
    };
    //删除服务session
    GatewayFunction.clear_server_session = function (stype) {
        if (server_session_map[stype]) {
            delete server_session_map[stype];
        }
    };
    return GatewayFunction;
}());
exports["default"] = GatewayFunction;
//# sourceMappingURL=GatewayHandle.js.map