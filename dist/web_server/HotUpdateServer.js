"use strict";
//web 热更新服务器
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
var KW_WWW_ROOT_PATH = "www_root";
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
function start_hotupdate_server() {
    try {
        var cwdPath = path.join(__dirname, KW_WWW_ROOT_PATH);
        if (fs.existsSync(cwdPath)) {
            app_express.use(express_1["default"].static(cwdPath));
        }
        else {
            Log_1["default"].error("path: ", cwdPath, " is not exists, start hotupdate server failed!");
            return;
        }
    }
    catch (error) {
        Log_1["default"].error("start_hotupdate_server error: ", error);
    }
    app_express.listen(GameAppConfig_1["default"].hotupdate_webserver.port);
    Log_1["default"].info("start hotupdate server success, address: ", GameAppConfig_1["default"].hotupdate_webserver.host + ":" + GameAppConfig_1["default"].hotupdate_webserver.port);
}
start_hotupdate_server();
//# sourceMappingURL=HotUpdateServer.js.map