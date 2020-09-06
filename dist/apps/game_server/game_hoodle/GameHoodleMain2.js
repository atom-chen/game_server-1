"use strict";
/*
    服务器启动文件
    注意： vscode调试服务器: 先用compile_src.bat编译成js,再找到服务器的xxxxMain.ts文件打开，f5调试，看到日志后才算成功。
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var NetBus_1 = __importDefault(require("../../../netbus/NetBus"));
var ServiceManager_1 = __importDefault(require("../../../netbus/ServiceManager"));
var Stype_1 = require("../../protocol/Stype");
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var GameHoodleService_1 = __importDefault(require("./GameHoodleService"));
var MySqlAuth_1 = __importDefault(require("../../../database/MySqlAuth"));
var MatchManager_1 = __importDefault(require("./manager/MatchManager"));
var GameAppConfig_1 = __importDefault(require("../../config/GameAppConfig"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var game_server = GameAppConfig_1["default"].game_server_2;
NetBus_1["default"].start_tcp_server(game_server.host, game_server.port, false);
ServiceManager_1["default"].register_service(Stype_1.Stype.GameHoodle, GameHoodleService_1["default"]);
//游戏服务
var db_game = GameAppConfig_1["default"].game_database;
MySqlGame_1["default"].connect(db_game.host, db_game.port, db_game.db_name, db_game.uname, db_game.upwd);
//用户中心服务
var db_auth = GameAppConfig_1["default"].auth_database;
MySqlAuth_1["default"].connect(db_auth.host, db_auth.port, db_auth.db_name, db_auth.uname, db_auth.upwd);
//匹配场
MatchManager_1["default"].getInstance().start_match();
//内存使用打印
function print_memery() {
    var memUsage = process.memoryUsage();
    var cpuUsage = process.cpuUsage();
    var mem_format = function (bytes) {
        return (bytes / 1024 / 1024).toFixed(2) + 'MB';
    };
    Log_1["default"].info('memeryUsage: heapTotal(' + mem_format(memUsage.heapTotal) + ') ,heapUsed(' + mem_format(memUsage.heapUsed) + ') ,rss(' + mem_format(memUsage.rss) + ")");
    Log_1["default"].info("cpuUsage: system(" + mem_format(cpuUsage.system) + ") ,user(" + mem_format(cpuUsage.user) + ")");
}
// setInterval(function() {
// 	print_memery();
// },1000);
//# sourceMappingURL=GameHoodleMain2.js.map