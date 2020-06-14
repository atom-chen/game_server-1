"use strict";
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
var GameAppConfig_1 = __importDefault(require("../apps/config/GameAppConfig"));
var Log_1 = __importDefault(require("../utils/Log"));
var MysqlSystem_1 = __importDefault(require("../database/MysqlSystem"));
var game_database = GameAppConfig_1["default"].game_database;
MysqlSystem_1["default"].connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);
var testAsyc = /** @class */ (function () {
    function testAsyc() {
    }
    testAsyc.timeout_fun = function () {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                Log_1["default"].info("timeout_func>>>>>>>>>>>11111");
                resolve("this is timeout func.........");
            }, 3000);
        });
    };
    testAsyc.testfunc = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // let result = await MySqlSystem.test_func(1918);
                    // let result = MySqlSystem.test_func(0);
                    // Log.info("hcc>>result: ", result);
                    return [4 /*yield*/, this.timeout_fun()];
                    case 1:
                        // let result = await MySqlSystem.test_func(1918);
                        // let result = MySqlSystem.test_func(0);
                        // Log.info("hcc>>result: ", result);
                        _a.sent();
                        Log_1["default"].info("hcc>>result222: ");
                        // try {
                        // } catch ( error) {
                        //     Log.error("hcc>>error: " , error);
                        // }
                        return [2 /*return*/, 0];
                }
            });
        });
    };
    return testAsyc;
}());
exports["default"] = testAsyc;
/*
await 必须和async配对使用

加了await:
await会等待await 执行完成后再执行下面(await必须等待一个Promise,不然不会生效)

不加await:
会先执行await下面的，再执行await

加了async:
函数返回值会变成promise

不加async:
函数返回值不变
*/
var ret = testAsyc.testfunc();
// Log.info("ret33333: " , ret);
//# sourceMappingURL=async_await_test.js.map