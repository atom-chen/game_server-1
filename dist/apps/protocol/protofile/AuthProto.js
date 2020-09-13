"use strict";
var _a;
exports.__esModule = true;
var AuthProto = /** @class */ (function () {
    function AuthProto() {
    }
    AuthProto.protoNameSpace = "auth.client.proto"; //proto命名空间
    AuthProto.protoFileName = "AuthProtoMsg"; //编译出来后xxxProtoMsg.js的文件名，不用加.js
    AuthProto.XY_ID = {
        INVALED: 0,
        REQ_UNAMEREGIST: 10001,
        RES_UNAMEREGIST: 10002,
        REQ_UNAMELOGIN: 10003,
        RES_UNAMELOGIN: 10004,
        REQ_GUESTLOGIN: 10005,
        RES_GUESTLOGIN: 10006,
        REQ_WECHATLOGIN: 10007,
        RES_WECHATLOGIN: 10008,
        REQ_WECHATSESSIONLOGIN: 10009,
        RES_WECHATSESSIONLOGIN: 10010,
        REQ_LOGINOUT: 10011,
        RES_LOGINOUT: 10012,
        PUSH_RELOGIN: 10013,
        REQ_USERCENTERINFO: 10014,
        RES_USERCENTERINFO: 10015
    };
    AuthProto.XY_NAME = (_a = {},
        _a[AuthProto.XY_ID.REQ_UNAMEREGIST] = "ReqUnameRegist",
        _a[AuthProto.XY_ID.RES_UNAMEREGIST] = "ResUnameRegist",
        _a[AuthProto.XY_ID.REQ_UNAMELOGIN] = "ReqUnameLogin",
        _a[AuthProto.XY_ID.RES_UNAMELOGIN] = "ResUnameLogin",
        _a[AuthProto.XY_ID.REQ_GUESTLOGIN] = "ReqGuestLogin",
        _a[AuthProto.XY_ID.RES_GUESTLOGIN] = "ResGuestLogin",
        _a[AuthProto.XY_ID.REQ_WECHATLOGIN] = "ReqWeChatLogin",
        _a[AuthProto.XY_ID.RES_WECHATLOGIN] = "ResWeChatLogin",
        _a[AuthProto.XY_ID.REQ_WECHATSESSIONLOGIN] = "ReqWeChatSessionLogin",
        _a[AuthProto.XY_ID.RES_WECHATSESSIONLOGIN] = "ResWeChatSessionLogin",
        _a[AuthProto.XY_ID.REQ_LOGINOUT] = "ReqLoginOut",
        _a[AuthProto.XY_ID.RES_LOGINOUT] = "ResLoginOut",
        _a[AuthProto.XY_ID.PUSH_RELOGIN] = "PushRelogin",
        _a[AuthProto.XY_ID.REQ_USERCENTERINFO] = "ReqUserCenterInfo",
        _a[AuthProto.XY_ID.RES_USERCENTERINFO] = "ResUserCenterInfo",
        _a);
    return AuthProto;
}());
exports["default"] = AuthProto;
//# sourceMappingURL=AuthProto.js.map