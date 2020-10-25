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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ServiceBase_1 = __importDefault(require("../../netengine/ServiceBase"));
var NetClient_1 = __importDefault(require("../../netengine/NetClient"));
var Log_1 = __importDefault(require("../../utils/Log"));
var GameRouteData_1 = __importDefault(require("./GameRouteData"));
var NetServer_1 = __importDefault(require("../../netengine/NetServer"));
var RedisLobby_1 = __importDefault(require("../../database/RedisLobby"));
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
        return __awaiter(this, void 0, void 0, function () {
            var server_key, roominfo_json, roominfo_obj, server_session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!utag || utag == 0) {
                            Log_1["default"].error("utag is invalid");
                            return [2 /*return*/];
                        }
                        server_key = -1;
                        return [4 /*yield*/, RedisLobby_1["default"].get_roominfo_by_uid(utag)];
                    case 1:
                        roominfo_json = _a.sent();
                        if (roominfo_json) {
                            try {
                                roominfo_obj = JSON.parse(roominfo_json);
                                server_key = roominfo_obj.game_serverid;
                            }
                            catch (error) {
                                Log_1["default"].error("on_recv_client_player_cmd>>", error);
                                return [2 /*return*/];
                            }
                        }
                        Log_1["default"].info("send to server port:", server_key);
                        if (server_key == null || server_key == undefined || server_key < 0 || typeof (server_key) != "number") {
                            Log_1["default"].error("server_index is invalid!", server_key);
                            return [2 /*return*/];
                        }
                        server_session = GameRouteData_1["default"].get_logic_server_session(server_key);
                        if (server_session && server_session.is_connected) {
                            NetClient_1["default"].send_encoded_cmd(server_session, raw_cmd);
                        }
                        else {
                            Log_1["default"].error("hcc>>send data to:", server_key, "error!,  server is not started!!!!");
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    // 收到连接的其他服务发过来的消息,这里发给gateway,从而转发到客户端
    // session : connected to other server`s session
    GameRouteService.on_recv_server_player_cmd = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var gateway_session = GameRouteData_1["default"].get_gateway_session();
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