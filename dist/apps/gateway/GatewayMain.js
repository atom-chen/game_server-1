"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
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
var GameAppConfig_1 = __importDefault(require("../config/GameAppConfig"));
var NetServer_1 = __importDefault(require("../../netbus/NetServer"));
var GatewayService_1 = __importDefault(require("./GatewayService"));
var ServiceManager_1 = __importDefault(require("../../netbus/ServiceManager"));
var NetClient_1 = __importDefault(require("../../netbus/NetClient"));
var GatewayFunction_1 = __importDefault(require("./GatewayFunction"));
var Log_1 = __importDefault(require("../../utils/Log"));
var util = __importStar(require("util"));
var Platform_1 = __importDefault(require("../../utils/Platform"));
var fs = __importStar(require("fs"));
var Stype_1 = require("../protocol/Stype");
NetServer_1["default"].start_tcp_server(GameAppConfig_1["default"].gateway_config.host, GameAppConfig_1["default"].gateway_config.tcp_port, false);
NetServer_1["default"].start_ws_server(GameAppConfig_1["default"].gateway_config.host, GameAppConfig_1["default"].gateway_config.wbsocket_port, false);
// 连接其他服务器
/*
var game_server = GameAppConfig.gw_connect_servers;
for(var key in game_server) {
    NetClient.connect_tcp_server(game_server[key].host, game_server[key].port, false, game_server[key].stype, function(server_session:any) {
        GatewayFunction.save_server_session(server_session,server_session.stype);
    });
    ServiceManager.register_service(game_server[key].stype, GatewayService);
}
*/
var connect_server_callBack = function (status, data) {
    if (status == true) {
        var gw_connect_servers = data.gw_connect_servers;
        // Log.info("hcc>>gw_connect_servers:", gw_connect_servers);
        for (var k in gw_connect_servers) {
            var serverInfo = gw_connect_servers[k];
            var name_1 = serverInfo.name;
            var host = serverInfo.host;
            var port = serverInfo.port;
            var stype = serverInfo.stype;
            var isOpen = serverInfo.isOpen;
            if (name_1 && host && port && stype) {
                if (isOpen == true) {
                    if (util.isNullOrUndefined(ServiceManager_1["default"].get_service(stype))) {
                        var server_seeeion = GatewayFunction_1["default"].get_server_session(stype);
                        if (util.isNullOrUndefined(server_seeeion)) {
                            NetClient_1["default"].connect_tcp_server(host, port, false, stype, function (server_session) {
                                GatewayFunction_1["default"].save_server_session(server_session, server_session.stype);
                            });
                        }
                        ServiceManager_1["default"].register_service(stype, GatewayService_1["default"]);
                        // Log.info("hcc>>ServiceManager.register_service" , stype)
                    }
                }
                else {
                    var server_seeeion = GatewayFunction_1["default"].get_server_session(stype);
                    if (!util.isNullOrUndefined(server_seeeion)) {
                        ServiceManager_1["default"].unregister_service(stype); //使协议发送不到该服务，但是该服务还是开启的，并没有close
                        Log_1["default"].warn('【' + Stype_1.StypeName[stype] + '】', "ServiceManager.unregister_service !!");
                    }
                }
            }
        }
    }
};
var local_host = "127.0.0.1";
var config_file_name = "";
if (Platform_1["default"].isWin32()) {
    local_host = Platform_1["default"].getLocalIP(); //本地电脑ip,pc调试用
    config_file_name = "server_config_local.json";
}
else if (Platform_1["default"].isLinux()) {
    local_host = "172.16.166.106"; //阿里云外网ip
    config_file_name = "server_config_remote.json";
}
//轮询读取本地配置来实现连接其他服务器
//实现修改配置来开启/停止服务器
var file = __dirname + "../../../web_server/config_root/server_config/" + config_file_name;
setInterval(function () {
    // 异步读取本地配置
    fs.readFile(file, function (err, data) {
        if (err) {
            Log_1["default"].error(err);
            return;
        }
        // Log.info("异步读取: " + data.toString());
        var dataString = data.toString();
        if (Platform_1["default"].isWin32()) {
            dataString = dataString.replace(/127.0.0.1/g, local_host);
        }
        if (dataString) {
            try {
                var jsonObj = JSON.parse(dataString);
                if (jsonObj) {
                    connect_server_callBack(true, jsonObj);
                }
            }
            catch (error) {
                Log_1["default"].error(error);
            }
        }
    });
}, 1000);
//# sourceMappingURL=GatewayMain.js.map