"use strict";
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
var DataModelAuth_1 = __importDefault(require("./DataModelAuth"));
var DataService = /** @class */ (function (_super) {
    __extends(DataService, _super);
    function DataService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.service_name = "DataService"; // 服务名称
        _this.is_transfer = false; // 是否为转发模块,
        return _this;
    }
    // 收到客户端，或者其他服务发来的数据
    DataService.on_recv_client_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        // if(stype == Stype.Auth){
        // } else if (stype == Stype.GameHoodle){
        //     DataModelGame.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
        // } else if (stype == Stype.GameSystem){
        //     DataModelSystem.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
        // }
        DataModelAuth_1["default"].getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
    };
    // 收到连接的其他服务发过来的消息，这里不做处理
    DataService.on_recv_server_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
    };
    // 收到客户端断开连接(和当前服务直接连接的客户端，当前作为服务端)
    DataService.on_player_disconnect = function (session, stype) {
    };
    return DataService;
}(ServiceBase_1["default"]));
exports["default"] = DataService;
//# sourceMappingURL=DataService.js.map