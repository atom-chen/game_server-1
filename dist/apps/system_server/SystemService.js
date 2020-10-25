"use strict";
//系统服务
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ServiceBase_1 = __importDefault(require("../../netengine/ServiceBase"));
var SystemModel_1 = __importDefault(require("./SystemModel"));
var SystemService = /** @class */ (function (_super) {
    __extends(SystemService, _super);
    function SystemService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.service_name = "SystemService"; // 服务名称
        _this.is_transfer = false; // 是否为转发模块,
        return _this;
    }
    // 收到客户端，或者其他服务发来的数据
    SystemService.on_recv_client_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        SystemModel_1["default"].getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
    };
    return SystemService;
}(ServiceBase_1["default"]));
exports["default"] = SystemService;
//# sourceMappingURL=SystemService.js.map