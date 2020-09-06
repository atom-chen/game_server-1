"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("./ProtoManager"));
var Stype_1 = require("../apps/protocol/Stype");
var Log_1 = __importDefault(require("../utils/Log"));
var util = __importStar(require("util"));
var ServiceManager = /** @class */ (function () {
    function ServiceManager() {
    }
    ServiceManager.register_service = function (stype, service) {
        if (ServiceManager.service_modules[stype]) {
            Log_1["default"].warn('【' + Stype_1.StypeName[stype] + '】', "registed failed, service is registed !!!!");
        }
        ServiceManager.service_modules[stype] = service;
        Log_1["default"].warn('【' + Stype_1.StypeName[stype] + '】', "registed success !!!!");
    };
    ServiceManager.unregister_service = function (stype) {
        if (ServiceManager.service_modules[stype]) {
            delete ServiceManager.service_modules[stype];
        }
    };
    ServiceManager.get_service = function (stype) {
        return this.service_modules[stype];
    };
    ServiceManager.on_recv_server_cmd = function (session, cmd_buf) {
        if (session.is_encrypt) {
            cmd_buf = ProtoManager_1["default"].decrypt_cmd(cmd_buf);
        }
        var cmd = ProtoManager_1["default"].decode_cmd_header(cmd_buf);
        if (!cmd) {
            return false;
        }
        var stype = cmd[0];
        var ctype = cmd[1];
        var utag = cmd[2];
        var proto_type = cmd[3];
        if (!ServiceManager.service_modules[stype]) {
            Log_1["default"].error("cur as client ServiceManager.service_modules not exist>> service: ", Stype_1.StypeName[stype]);
            return false;
        }
        if (util.isNullOrUndefined(stype) || util.isNullOrUndefined(ctype) || util.isNullOrUndefined(utag) || util.isNullOrUndefined(proto_type)) {
            Log_1["default"].error("cmd error");
            return false;
        }
        if (ServiceManager.service_modules[stype].on_recv_server_player_cmd) {
            ServiceManager.service_modules[stype].on_recv_server_player_cmd(session, stype, ctype, utag, proto_type, cmd_buf);
        }
        return true;
    };
    ServiceManager.on_recv_client_cmd = function (session, cmd_buf) {
        // 根据收到的数据解码命令
        if (!cmd_buf) {
            return false;
        }
        if (session.is_encrypt) {
            cmd_buf = ProtoManager_1["default"].decrypt_cmd(cmd_buf);
        }
        var cmd = ProtoManager_1["default"].decode_cmd_header(cmd_buf);
        if (!cmd) {
            return false;
        }
        var stype = cmd[0];
        var ctype = cmd[1];
        var utag = cmd[2];
        var proto_type = cmd[3];
        if (!ServiceManager.service_modules[stype]) {
            Log_1["default"].error("cur as server ServiceManager.service_modules not exist>>service: ", Stype_1.StypeName[stype]);
            return false;
        }
        if (util.isNullOrUndefined(stype) || util.isNullOrUndefined(ctype) || util.isNullOrUndefined(utag) || util.isNullOrUndefined(proto_type)) {
            Log_1["default"].error("cmd error");
            return false;
        }
        if (ServiceManager.service_modules[stype].on_recv_client_player_cmd) {
            ServiceManager.service_modules[stype].on_recv_client_player_cmd(session, stype, ctype, utag, proto_type, cmd_buf);
        }
        return true;
    };
    // 玩家掉线
    ServiceManager.on_client_lost_connect = function (session) {
        // 遍历所有的服务模块通知在这个服务上的这个玩家掉线了
        for (var stype in ServiceManager.service_modules) {
            if (ServiceManager.service_modules[stype].on_player_disconnect) {
                ServiceManager.service_modules[stype].on_player_disconnect(session, stype);
            }
        }
    };
    ServiceManager.service_modules = {};
    return ServiceManager;
}());
exports["default"] = ServiceManager;
//# sourceMappingURL=ServiceManager.js.map