"use strict";
//web 服务器，获取服务端接口
//热更新配置
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var GameAppConfig_1 = __importDefault(require("../apps/config/GameAppConfig"));
var Log_1 = __importDefault(require("../utils/Log"));
var app_express = express_1["default"]();
//跨域访问
app_express.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
function start_config_web_server() {
    // 获取客户端连接的服务器信息, 
    // http://127.0.0.1:6070/server_info
    app_express.get("/server_info", function (request, respones) {
        Log_1["default"].info("hcc>>get: ", request.url);
        // Log.info("hcc>>request: ", request);
        // Log.info("hcc>>response: ", respones);
        var body = {
            host: GameAppConfig_1["default"].gateway_config.host,
            tcp_port: GameAppConfig_1["default"].gateway_config.tcp_port,
            ws_port: GameAppConfig_1["default"].gateway_config.wbsocket_port
        };
        var str_data = JSON.stringify(body);
        respones.send(str_data);
    });
    app_express.listen(GameAppConfig_1["default"].config_webserver.port);
    Log_1["default"].info("start config server success, address: ", GameAppConfig_1["default"].config_webserver.host + ":" + GameAppConfig_1["default"].config_webserver.port);
}
start_config_web_server();
//# sourceMappingURL=ConfigServer.js.map