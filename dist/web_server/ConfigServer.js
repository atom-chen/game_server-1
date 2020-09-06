"use strict";
//web 服务器，获取服务端接口
//热更新配置
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var express_1 = __importDefault(require("express"));
var GameAppConfig_1 = __importDefault(require("../apps/config/GameAppConfig"));
var Log_1 = __importDefault(require("../utils/Log"));
var KW_WWW_ROOT_PATH = "config_root";
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
try {
    var cwdPath = path.join(__dirname, KW_WWW_ROOT_PATH);
    if (fs.existsSync(cwdPath)) {
        app_express.use(express_1["default"].static(cwdPath));
    }
    else {
        Log_1["default"].error("path: ", cwdPath, " is not exists, start config server failed!");
    }
}
catch (error) {
    Log_1["default"].error("start_config_server error: ", error);
}
// 获取客户端连接的服务器信息, 
// http://www.hccfun.com:6091/server_info
app_express.get("/server_info", function (request, respones) {
    Log_1["default"].info("hcc>>get: ", request.url);
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
//# sourceMappingURL=ConfigServer.js.map