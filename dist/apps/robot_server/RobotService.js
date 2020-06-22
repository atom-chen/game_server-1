"use strict";
//机器人服务
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
var ServiceBase_1 = __importDefault(require("../../netbus/ServiceBase"));
var RobotModel_1 = __importDefault(require("./RobotModel"));
var RobotService = /** @class */ (function (_super) {
    __extends(RobotService, _super);
    function RobotService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.service_name = "RobotService";
        _this.is_transfer = false;
        return _this;
    }
    //收到客户端发来的(当前作为服务端)
    RobotService.on_recv_client_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
    };
    //收到连接的服务发过来的数据（当前作为客户端）
    RobotService.on_recv_server_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        RobotModel_1["default"].getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
    };
    // 收到客户端断开连接
    RobotService.on_player_disconnect = function (session, stype) {
    };
    return RobotService;
}(ServiceBase_1["default"]));
exports["default"] = RobotService;
//# sourceMappingURL=RobotService.js.map