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
var SystemSend_1 = __importDefault(require("../SystemSend"));
var MysqlSystem_1 = __importDefault(require("../../../database/MysqlSystem"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var SystemProto_1 = require("../../protocol/SystemProto");
var Log_1 = __importDefault(require("../../../utils/Log"));
var LoginRewardConfig_1 = require("../config/LoginRewardConfig");
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var TimeUtil_1 = __importDefault(require("../../../utils/TimeUtil"));
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var bonues_max_days = 7; //连续签到最大天数
var LoginRewardInterface = /** @class */ (function () {
    function LoginRewardInterface() {
    }
    //请求签到配置
    LoginRewardInterface.do_user_login_reward_config = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var data, ret, sql_info, bonues_days, bonues_time, config, day, config_obj, day_index, istodaysign, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, MysqlSystem_1["default"].get_login_bonues_info_by_uid(utag)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 5];
                        if (!(data.length <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, MysqlSystem_1["default"].insert_login_bonues_info(utag, 0, 0, 0, 0)];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        sql_info = data[0];
                        bonues_days = sql_info.days;
                        bonues_time = sql_info.bonues_time;
                        config = ArrayUtil_1["default"].ObjClone(LoginRewardConfig_1.LoginRewardConfig);
                        for (day in config) {
                            config_obj = config[day];
                            day_index = Number(day);
                            if (day_index <= bonues_days) {
                                config_obj["isget"] = true;
                                config_obj["canget"] = false;
                            }
                            if ((day_index == (bonues_days + 1) % bonues_max_days) || day_index == bonues_max_days) {
                                if (bonues_time == 0 || bonues_time != TimeUtil_1["default"].timestamp_today()) {
                                    config_obj["isget"] = false;
                                    config_obj["canget"] = true;
                                }
                            }
                        }
                        istodaysign = bonues_time == TimeUtil_1["default"].timestamp_today();
                        resbody = {
                            status: 1,
                            signdays: bonues_days,
                            istodaysign: istodaysign,
                            config: JSON.stringify(config)
                        };
                        Log_1["default"].info("hcc>>do_user_login_reward_config: ", resbody);
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, resbody);
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    //执行签到
    LoginRewardInterface.do_user_login_reward_sign = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, signofday, time_now, data, data_obj, bonues_time, days, days_now, ret_update, propcount, ret, rewardObj, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) return [3 /*break*/, 4];
                        signofday = body.signofday;
                        time_now = TimeUtil_1["default"].timestamp_today();
                        return [4 /*yield*/, MysqlSystem_1["default"].get_login_bonues_info_by_uid(utag)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        if (!(data.length > 0)) return [3 /*break*/, 4];
                        data_obj = data[0];
                        bonues_time = data_obj.bonues_time;
                        days = data_obj.days;
                        days_now = (days + 1) % bonues_max_days;
                        Log_1["default"].info("hcc>>do_user_login_reward_sign bonues_info: ", data);
                        if (!(bonues_time != time_now && signofday == days_now)) return [3 /*break*/, 4];
                        return [4 /*yield*/, MysqlSystem_1["default"].update_login_bonues_info(utag, 0, time_now, days_now, 1)];
                    case 2:
                        ret_update = _a.sent();
                        if (!ret_update) return [3 /*break*/, 4];
                        propcount = LoginRewardConfig_1.LoginRewardConfig[signofday].propcount;
                        if (!propcount) return [3 /*break*/, 4];
                        return [4 /*yield*/, MySqlGame_1["default"].add_ugame_uchip(utag, propcount)];
                    case 3:
                        ret = _a.sent();
                        if (ret) {
                            rewardObj = {
                                propid: LoginRewardConfig_1.LoginRewardConfig[signofday].propid,
                                propcount: LoginRewardConfig_1.LoginRewardConfig[signofday].propcount
                            };
                            resbody = {
                                status: Response_1["default"].OK,
                                rewardconfig: JSON.stringify(rewardObj)
                            };
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, resbody);
                            Log_1["default"].info("hcc>>do_user_login_reward_sign success ", resbody);
                            return [2 /*return*/];
                        }
                        _a.label = 4;
                    case 4:
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    //test use async await
    LoginRewardInterface.do_user_login_reward_sign_1 = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, signofday, time_now, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) return [3 /*break*/, 2];
                        signofday = body.signofday;
                        time_now = TimeUtil_1["default"].timestamp_today();
                        return [4 /*yield*/, MysqlSystem_1["default"].test_func(utag)];
                    case 1:
                        result = _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return LoginRewardInterface;
}());
exports["default"] = LoginRewardInterface;
//# sourceMappingURL=LoginRewardInterface.js.map