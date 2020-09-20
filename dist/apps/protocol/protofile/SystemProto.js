"use strict";
var _a;
exports.__esModule = true;
var SystemProto = /** @class */ (function () {
    function SystemProto() {
    }
    SystemProto.protoNameSpace = "system.client.proto"; //proto命名空间
    SystemProto.protoFileName = "SystemProtoMsg"; //编译出来后xxxProtoMsg.js的文件名，不用加.js
    SystemProto.XY_ID = {
        INVALED: 0,
        REQ_LOGINREWARDCONFIG: 101,
        RES_LOGINREWARDCONFIG: 102,
        REQ_LOGINREWARDSIGN: 103,
        RES_LOGINREWARDSIGN: 104,
        REQ_USERSHARE: 105,
        RES_USERSHARE: 106,
        REQ_USERADDCHIP: 107,
        RES_USERADDCHIP: 108
    };
    SystemProto.XY_NAME = (_a = {},
        _a[SystemProto.XY_ID.REQ_LOGINREWARDCONFIG] = "reqLoginRewardConfig",
        _a[SystemProto.XY_ID.RES_LOGINREWARDCONFIG] = "ResLoginRewardConfig",
        _a[SystemProto.XY_ID.REQ_LOGINREWARDSIGN] = "ReqLoginRewardSign",
        _a[SystemProto.XY_ID.RES_LOGINREWARDSIGN] = "ResLoginRewardSign",
        _a[SystemProto.XY_ID.REQ_USERSHARE] = "ReqUserShare",
        _a[SystemProto.XY_ID.RES_USERSHARE] = "ResUserShare",
        _a[SystemProto.XY_ID.REQ_USERADDCHIP] = "ReqUserAddChip",
        _a[SystemProto.XY_ID.RES_USERADDCHIP] = "ResUserAddChip",
        _a);
    return SystemProto;
}());
exports["default"] = SystemProto;
//# sourceMappingURL=SystemProto.js.map