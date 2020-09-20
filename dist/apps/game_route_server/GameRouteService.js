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
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameRouteSaveSession_1 = __importDefault(require("./GameRouteSaveSession"));
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var GameRouteService = /** @class */ (function (_super) {
    __extends(GameRouteService, _super);
    function GameRouteService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.service_name = "LogicRouteService"; // 服务名`称
        _this.is_transfer = false; // 是否为转发模块,
        return _this;
    }
    // 收到客户端，或者其他服务发来的数据 on_recv_client_player_cmd
    //session: gateway session
    GameRouteService.on_recv_client_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        //选择一个没有超负载的服务进行发送消息，并进行标记，下次发消息也发给当前标记服务
        // utag_server_ip_port_map  保存客户端utag 和服务端ip_port的映射，使得下次发消息会发送到该服务端
        // utag_server_ip_port_map = {utag: server_ip_port_key}
        if (!utag || utag == 0) {
            Log_1["default"].error("utag is invalid");
            return;
        }
        var server_session = null;
        if (session.utag_server_ip_port_map) {
            var server_key = session.utag_server_ip_port_map[utag];
            server_session = NetClient_1["default"].get_server_session(server_key);
            if (server_session) {
                NetClient_1["default"].send_encoded_cmd(server_session, raw_cmd);
            }
            else {
                server_session = NetClient_1["default"].choose_server();
                if (server_session) {
                    NetClient_1["default"].send_encoded_cmd(server_session, raw_cmd);
                    session.utag_server_ip_port_map[utag] = server_session.session_key;
                    server_session.load_count++;
                    Log_1["default"].info("hcc>>load111: ", server_session.load_count);
                }
            }
        }
        else {
            server_session = NetClient_1["default"].choose_server();
            if (server_session) {
                NetClient_1["default"].send_encoded_cmd(server_session, raw_cmd);
                server_session.load_count++;
                Log_1["default"].info("hcc>>load222: ", server_session.load_count);
                var utag_ip_port_map = {};
                utag_ip_port_map[utag] = server_session.session_key;
                session.utag_server_ip_port_map = utag_ip_port_map;
            }
        }
        //有玩家掉线就删掉对应
        if (ctype == CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION) {
            if (session.utag_server_ip_port_map) {
                session.utag_server_ip_port_map[utag] = null;
                delete session.utag_server_ip_port_map[utag];
            }
            if (server_session) {
                server_session.load_count--;
                Log_1["default"].info("hcc>>load333: ", server_session.load_count);
            }
        }
    };
    // 收到连接的其他服务发过来的消息,这里发给gateway,从而转发到客户端
    // session : connected to other server`s session
    GameRouteService.on_recv_server_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var gateway_session = GameRouteSaveSession_1["default"].get_gateway_session();
        if (gateway_session) {
            NetServer_1["default"].send_encoded_cmd(gateway_session, raw_cmd); //发给网关
        }
    };
    // 收到客户端断开连接(和当前服务直接连接的客户端，当前作为服务端)
    // session: gateway session
    // 这里表示gateway 断开连接了
    GameRouteService.on_player_disconnect = function (session, stype) {
    };
    return GameRouteService;
}(ServiceBase_1["default"]));
exports["default"] = GameRouteService;
//# sourceMappingURL=GameRouteService.js.map