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
var GameHoodleProto_1 = require("../../../protocol/protofile/GameHoodleProto");
var Log_1 = __importDefault(require("../../../../utils/Log"));
var MySqlGame_1 = __importDefault(require("../../../../database/MySqlGame"));
var GameHoodleConfig_1 = __importDefault(require("../config/GameHoodleConfig"));
var Response_1 = __importDefault(require("../../../protocol/Response"));
var ArrayUtil_1 = __importDefault(require("../../../../utils/ArrayUtil"));
var PlayerManager_1 = __importDefault(require("../manager/PlayerManager"));
var ProtoManager_1 = __importDefault(require("../../../../netbus/ProtoManager"));
var StoreConfig_1 = __importDefault(require("../config/StoreConfig"));
var querystring_1 = __importDefault(require("querystring"));
var playerMgr = PlayerManager_1["default"].getInstance();
var GameInfoInterface = /** @class */ (function () {
    function GameInfoInterface() {
    }
    ////////////////////////////////////////
    ///本地接口
    ////////////////////////////////////////
    //更新玩家弹珠接口, 只更新到玩家缓存，没更新到数据库
    GameInfoInterface.user_update_ball_info = function (player, updatetype, level, count) {
        var compose_count = GameHoodleConfig_1["default"].BALL_COPOSE_NUM;
        var key_str = GameHoodleConfig_1["default"].BALL_SAVE_KEY_STR;
        var uball_obj_player = {};
        var is_success = false;
        try {
            uball_obj_player = JSON.parse(player.get_uball_info());
        }
        catch (error) {
            Log_1["default"].error(error);
            return false;
        }
        // Log.info("hcc>>111," , uball_obj_player);
        var level_key_str = key_str + level;
        if (updatetype == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.SELL_TYPE) { //售卖
            var ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) > 0) {
                uball_obj_player[level_key_str] = Number(ball_count) - 1;
                is_success = true;
            }
        }
        else if (updatetype == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.COMPOSE_TYPE) { //合成
            var ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) >= compose_count) {
                uball_obj_player[level_key_str] = String(Number(ball_count) - compose_count);
                level_key_str = key_str + String(level + 1);
                if (uball_obj_player[level_key_str]) {
                    uball_obj_player[level_key_str] = String(Number(uball_obj_player[level_key_str]) + 1);
                    ;
                }
                else {
                    uball_obj_player[level_key_str] = "1";
                }
                is_success = true;
            }
        }
        else if (updatetype == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.ADD_TYPE) { //增加弹珠
            var ball_count = uball_obj_player[level_key_str];
            if (ball_count) {
                uball_obj_player[level_key_str] = String(Number(ball_count) + count);
                ;
            }
            else {
                uball_obj_player[level_key_str] = String(count);
            }
            is_success = true;
        }
        else if (updatetype == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.REDUCE_TYPE) { //减少弹珠
            var ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) >= count) {
                uball_obj_player[level_key_str] = Number(ball_count) - count;
                is_success = true;
            }
        }
        if (is_success) {
            player.set_uball_info(JSON.stringify(uball_obj_player));
        }
        return is_success;
    };
    ////////////////////////////////////////
    ///对外接口
    ////////////////////////////////////////
    //获取游戏服务信息
    GameInfoInterface.do_player_get_ugame_info = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            var player, data_game, data_game_len, ugameInfo, ugameInfoStr, body, ret_insert, data_game_ins_get, ugameInfo, ugameInfoStr, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_uchip_by_uid(utag)];
                    case 1:
                        data_game = _a.sent();
                        if (!data_game) return [3 /*break*/, 5];
                        data_game_len = ArrayUtil_1["default"].GetArrayLen(data_game);
                        if (!(data_game_len > 0)) return [3 /*break*/, 2];
                        ugameInfo = data_game[0];
                        ugameInfoStr = JSON.stringify(ugameInfo);
                        body = {
                            status: Response_1["default"].OK,
                            userinfostring: ugameInfoStr
                        };
                        player.set_ugame_info(ugameInfo);
                        player.send_cmd(GameHoodleProto_1.Cmd.eUserGameInfoRes, body);
                        return [2 /*return*/];
                    case 2: return [4 /*yield*/, MySqlGame_1["default"].insert_ugame_user(utag, GameHoodleConfig_1["default"].KW_BORN_EXP, GameHoodleConfig_1["default"].KW_BORN_CHIP)];
                    case 3:
                        ret_insert = _a.sent();
                        if (!ret_insert) return [3 /*break*/, 5];
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_uchip_by_uid(utag)];
                    case 4:
                        data_game_ins_get = _a.sent();
                        if (data_game_ins_get && data_game_ins_get.length > 0) {
                            ugameInfo = data_game_ins_get[0];
                            ugameInfoStr = JSON.stringify(ugameInfo);
                            body = {
                                status: Response_1["default"].OK,
                                userinfostring: ugameInfoStr
                            };
                            player.set_ugame_info(ugameInfo);
                            player.send_cmd(GameHoodleProto_1.Cmd.eUserGameInfoRes, body);
                            return [2 /*return*/];
                        }
                        _a.label = 5;
                    case 5:
                        player.send_cmd(GameHoodleProto_1.Cmd.eUserGameInfoRes, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    //获取弹珠信息
    GameInfoInterface.do_player_get_ball_info = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            var player, sql_ret, ret_len, info, uball_info_obj, uball_json, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_uball_info(player.get_uid())];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            ret_len = ArrayUtil_1["default"].GetArrayLen(sql_ret);
                            if (ret_len > 0) {
                                try {
                                    info = sql_ret[0];
                                    uball_info_obj = querystring_1["default"].decode(info.uball_info);
                                    uball_json = JSON.stringify(uball_info_obj);
                                    body = {
                                        status: Response_1["default"].OK,
                                        userballinfostring: uball_json
                                    };
                                    // Log.info("hcc>>on_ser_ball_info: ", uball_json);
                                    player.send_cmd(GameHoodleProto_1.Cmd.eUserBallInfoRes, body);
                                    player.set_uball_info(uball_json);
                                    return [2 /*return*/];
                                }
                                catch (error) {
                                    Log_1["default"].error(error);
                                }
                            }
                        }
                        player.send_cmd(GameHoodleProto_1.Cmd.eUserBallInfoRes, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    //兑换，卖出，等更新弹珠
    GameInfoInterface.do_player_update_ball_info = function (utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, data_body, up_type, level, count, is_success, resultObj, tmp_ball_json, body_ball, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        data_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        up_type = data_body.updatetype;
                        level = data_body.level;
                        count = data_body.count;
                        if (!(up_type == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.SELL_TYPE)) return [3 /*break*/, 1];
                        return [3 /*break*/, 4];
                    case 1:
                        if (!(up_type == GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.COMPOSE_TYPE)) return [3 /*break*/, 4];
                        is_success = GameInfoInterface.user_update_ball_info(player, up_type, level, count);
                        if (!is_success) return [3 /*break*/, 3];
                        resultObj = { level: level + 1 };
                        tmp_ball_json = player.get_uball_info();
                        body_ball = {
                            status: Response_1["default"].OK,
                            userballinfostring: tmp_ball_json,
                            resultinfo: JSON.stringify(resultObj)
                        };
                        return [4 /*yield*/, MySqlGame_1["default"].update_ugame_uball_info(player.get_uid(), tmp_ball_json)];
                    case 2:
                        ret = _a.sent();
                        if (ret) {
                            player.send_cmd(GameHoodleProto_1.Cmd.eUpdateUserBallRes, body_ball);
                            player.set_uball_info(tmp_ball_json);
                            return [2 /*return*/];
                        }
                        _a.label = 3;
                    case 3:
                        player.send_cmd(GameHoodleProto_1.Cmd.eUpdateUserBallRes, { status: Response_1["default"].INVALIDI_OPT });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //获取商城列表
    GameInfoInterface.do_player_store_list = function (utag) {
        var player = playerMgr.get_player(utag);
        var res_body = {
            status: Response_1["default"].OK,
            storeprops: StoreConfig_1["default"].getInstance().get_store_config()
        };
        player.send_cmd(GameHoodleProto_1.Cmd.eStoreListRes, res_body);
    };
    //玩家购买
    GameInfoInterface.do_player_buy_things = function (utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, req_body, storeConfig, propsvrindex, _a, _b, _i, key, shopInfo, propprice, propcount, propinfo, ret, is_success, update_ret, res_body;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        req_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!req_body) return [3 /*break*/, 6];
                        storeConfig = StoreConfig_1["default"].getInstance().get_store_config();
                        propsvrindex = req_body.propsvrindex;
                        _a = [];
                        for (_b in storeConfig)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        key = _a[_i];
                        shopInfo = storeConfig[key];
                        if (!(shopInfo.propsvrindex == propsvrindex)) return [3 /*break*/, 5];
                        propprice = shopInfo.propprice;
                        propcount = shopInfo.propcount;
                        propinfo = JSON.parse(shopInfo.propinfo);
                        if (!(Number(player.get_uchip()) >= propprice)) return [3 /*break*/, 4];
                        return [4 /*yield*/, MySqlGame_1["default"].add_ugame_uchip(player.get_uid(), propprice * (-1))];
                    case 2:
                        ret = _c.sent();
                        if (!ret) return [3 /*break*/, 4];
                        player.set_uchip(player.get_uchip() - propprice);
                        is_success = GameInfoInterface.user_update_ball_info(player, GameHoodleConfig_1["default"].BALL_UPDATE_TYPE.ADD_TYPE, propinfo.level, propcount);
                        if (!is_success) return [3 /*break*/, 4];
                        return [4 /*yield*/, MySqlGame_1["default"].update_ugame_uball_info(player.get_uid(), player.get_uball_info())];
                    case 3:
                        update_ret = _c.sent();
                        if (update_ret) {
                            res_body = {
                                status: Response_1["default"].OK,
                                propsvrindex: shopInfo.propsvrindex,
                                propid: shopInfo.propid,
                                propcount: shopInfo.propcount,
                                propprice: shopInfo.propprice,
                                propinfo: shopInfo.propinfo
                            };
                            player.send_cmd(GameHoodleProto_1.Cmd.eBuyThingsRes, res_body);
                            return [2 /*return*/];
                        }
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6:
                        player.send_cmd(GameHoodleProto_1.Cmd.eBuyThingsRes, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    //获取玩家配置
    GameInfoInterface.do_player_get_user_config = function (utag) {
        return __awaiter(this, void 0, void 0, function () {
            var player, sql_ret, ret_len, info, user_config_obj, body;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        return [4 /*yield*/, MySqlGame_1["default"].get_ugame_config_by_uid(player.get_uid())];
                    case 1:
                        sql_ret = _a.sent();
                        if (sql_ret) {
                            ret_len = ArrayUtil_1["default"].GetArrayLen(sql_ret);
                            if (ret_len > 0) {
                                try {
                                    info = sql_ret[0];
                                    user_config_obj = querystring_1["default"].decode(info.user_config);
                                    // Log.info("hcc>>do_player_get_user_config: ", user_config_obj);
                                    if (!user_config_obj[GameHoodleConfig_1["default"].USER_BALL_LEVEL_STR]) {
                                        user_config_obj[GameHoodleConfig_1["default"].USER_BALL_LEVEL_STR] = 1;
                                    }
                                    body = {
                                        status: Response_1["default"].OK,
                                        userconfigstring: JSON.stringify(user_config_obj)
                                    };
                                    player.send_cmd(GameHoodleProto_1.Cmd.eUserConfigRes, body);
                                    player.set_user_config(user_config_obj);
                                    return [2 /*return*/];
                                }
                                catch (error) {
                                    Log_1["default"].error(error);
                                    return [2 /*return*/];
                                }
                            }
                        }
                        player.send_cmd(GameHoodleProto_1.Cmd.eUserConfigRes, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    //使用弹珠
    GameInfoInterface.do_player_use_hoodleball = function (utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var player, req_body, balllevel, ball_obj, keyStr, userConfig, body, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        player = playerMgr.get_player(utag);
                        req_body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!req_body) return [3 /*break*/, 2];
                        balllevel = req_body.balllevel;
                        ball_obj = JSON.parse(player.get_uball_info());
                        if (!balllevel) return [3 /*break*/, 2];
                        keyStr = GameHoodleConfig_1["default"].BALL_SAVE_KEY_STR + balllevel;
                        if (!ball_obj[keyStr]) return [3 /*break*/, 2];
                        userConfig = player.get_user_config();
                        userConfig[GameHoodleConfig_1["default"].USER_BALL_LEVEL_STR] = balllevel;
                        player.set_user_config(userConfig);
                        body = {
                            status: Response_1["default"].OK,
                            balllevel: Number(balllevel)
                        };
                        player.send_cmd(GameHoodleProto_1.Cmd.eUseHoodleBallRes, body);
                        return [4 /*yield*/, MySqlGame_1["default"].update_ugame_user_config(player.get_uid(), player.get_user_config())];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            // Log.info("hcc>>update_ugame_user_config success ,ret: " , result);
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        player.send_cmd(GameHoodleProto_1.Cmd.eUseHoodleBallRes, { status: Response_1["default"].INVALIDI_OPT });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameInfoInterface;
}());
exports["default"] = GameInfoInterface;
//# sourceMappingURL=GameInfoInterface.js.map