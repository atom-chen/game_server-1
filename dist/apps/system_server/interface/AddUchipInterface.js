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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var GameHoodleConfig_1 = __importDefault(require("../../game_server/game_hoodle/config/GameHoodleConfig"));
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var SystemSend_1 = __importDefault(require("../SystemSend"));
var SystemProto_1 = require("../../protocol/SystemProto");
var Response_1 = __importDefault(require("../../protocol/Response"));
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var querystring_1 = __importDefault(require("querystring"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var util = __importStar(require("util"));
var AddUchipInterface = /** @class */ (function () {
    function AddUchipInterface() {
    }
    //增加玩家道具接口
    AddUchipInterface.do_user_add_chip_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, propid, propcount, config, ret, res_body, uball_info, level, sql_ret, ret_len, uball_info_obj, issuccess, ret, res_body, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) return [3 /*break*/, 9];
                        propid = body.propid;
                        propcount = body.propcount;
                        if (propcount <= 0) {
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                            return [2 /*return*/];
                        }
                        config = body.config;
                        if (!(propid == GameHoodleConfig_1["default"].KW_PROP_ID_COIN)) return [3 /*break*/, 2];
                        return [4 /*yield*/, MySqlGame_1["default"].add_ugame_uchip(utag, propcount)];
                    case 1:
                        ret = _a.sent();
                        if (ret) {
                            res_body = {
                                status: Response_1["default"].OK,
                                propid: propid,
                                propcount: propcount,
                                config: config
                            };
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, res_body);
                            return [2 /*return*/];
                        }
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                        return [3 /*break*/, 9];
                    case 2:
                        if (!(propid == GameHoodleConfig_1["default"].KW_PROP_ID_BALL)) return [3 /*break*/, 9];
                        if (util.isNullOrUndefined(config)) {
                            return [2 /*return*/];
                        }
                        uball_info = null;
                        try {
                            uball_info = JSON.parse(config);
                        }
                        catch (error) {
                            return [2 /*return*/];
                        }
                        level = uball_info.level;
                        if (util.isNullOrUndefined(uball_info) || util.isNullOrUndefined(level)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_uball_info(utag)];
                    case 3:
                        sql_ret = _a.sent();
                        if (!sql_ret) return [3 /*break*/, 8];
                        ret_len = ArrayUtil_1["default"].GetArrayLen(sql_ret);
                        if (!(ret_len > 0)) return [3 /*break*/, 8];
                        _a.label = 4;
                    case 4:
                        _a.trys.push([4, 7, , 8]);
                        uball_info_obj = querystring_1["default"].decode(sql_ret[0].uball_info);
                        issuccess = AddUchipInterface.user_update_ball_info(uball_info_obj, level, propcount);
                        if (!issuccess) return [3 /*break*/, 6];
                        return [4 /*yield*/, MySqlGame_1["default"].update_ugame_uball_info(utag, JSON.stringify(uball_info_obj))];
                    case 5:
                        ret = _a.sent();
                        if (ret) {
                            res_body = {
                                status: Response_1["default"].OK,
                                propid: propid,
                                propcount: propcount,
                                config: config
                            };
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, res_body);
                            return [2 /*return*/];
                        }
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _a.sent();
                        Log_1["default"].error(error_1);
                        return [3 /*break*/, 8];
                    case 8:
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //增加玩家弹珠接口, 只更新到玩家缓存，没更新到数据库
    /*
    uball_info_obj: {
        lv_1:1,
        lv_2:3,
        lv_3:4,
    }
    */
    AddUchipInterface.user_update_ball_info = function (uball_info_obj, level, count) {
        if (util.isNullOrUndefined(uball_info_obj) || util.isNullOrUndefined(level) || util.isNullOrUndefined(count)) {
            return false;
        }
        var key_str = GameHoodleConfig_1["default"].BALL_SAVE_KEY_STR;
        var uball_obj_player = uball_info_obj;
        var level_key_str = key_str + level;
        var ball_count = uball_obj_player[level_key_str];
        if (ball_count) {
            uball_obj_player[level_key_str] = String(Number(ball_count) + count);
            ;
        }
        else {
            uball_obj_player[level_key_str] = String(count);
        }
        return true;
    };
    return AddUchipInterface;
}());
exports["default"] = AddUchipInterface;
//# sourceMappingURL=AddUchipInterface.js.map