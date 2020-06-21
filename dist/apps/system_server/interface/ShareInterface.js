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
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var querystring_1 = __importDefault(require("querystring"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var TimeUtil_1 = __importDefault(require("../../../utils/TimeUtil"));
var SystemSend_1 = __importDefault(require("../SystemSend"));
var SystemProto_1 = require("../../protocol/SystemProto");
var SystemConfig_1 = __importDefault(require("../config/SystemConfig"));
var ShareInterface = /** @class */ (function () {
    function ShareInterface() {
    }
    ShareInterface.dn_user_share_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var sql_ret, ret_len, info, user_config_obj, share_time, ret_config, ret, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MySqlGame_1["default"].get_ugame_config_by_uid(utag)];
                    case 1:
                        sql_ret = _a.sent();
                        if (!sql_ret) return [3 /*break*/, 9];
                        ret_len = ArrayUtil_1["default"].GetArrayLen(sql_ret);
                        if (!(ret_len > 0)) return [3 /*break*/, 9];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 8, , 9]);
                        info = sql_ret[0];
                        user_config_obj = querystring_1["default"].decode(info.user_config);
                        share_time = user_config_obj[SystemConfig_1["default"].SHARE_DATE_TIME];
                        if (!(!share_time || share_time != TimeUtil_1["default"].timestamp_today())) return [3 /*break*/, 6];
                        user_config_obj[SystemConfig_1["default"].SHARE_DATE_TIME] = TimeUtil_1["default"].timestamp_today();
                        return [4 /*yield*/, MySqlGame_1["default"].update_ugame_user_config(utag, user_config_obj)];
                    case 3:
                        ret_config = _a.sent();
                        if (!ret_config) return [3 /*break*/, 5];
                        return [4 /*yield*/, MySqlGame_1["default"].add_ugame_uchip(utag, SystemConfig_1["default"].SHARE_REWARD_COUNT)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserShareRes, utag, proto_type, { status: Response_1["default"].OK });
                            Log_1["default"].info("hcc>>dn_user_share_req>> not share, share success!", utag);
                        }
                        return [2 /*return*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        Log_1["default"].info("hcc>>dn_user_share_req>> already share!!", utag);
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _a.sent();
                        Log_1["default"].error(error_1);
                        return [3 /*break*/, 9];
                    case 9:
                        //已经签到或者签到失败
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserShareRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    return ShareInterface;
}());
exports["default"] = ShareInterface;
//# sourceMappingURL=ShareInterface.js.map