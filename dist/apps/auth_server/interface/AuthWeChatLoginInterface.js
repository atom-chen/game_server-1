"use strict";
// 微信小程序登录
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
var MySqlAuth_1 = __importDefault(require("../../../database/MySqlAuth"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var AuthSendMsg_1 = __importDefault(require("../AuthSendMsg"));
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var util = __importStar(require("util"));
var https = __importStar(require("https"));
var iconv = __importStar(require("iconv-lite"));
var WXBizDataCrypt_1 = __importDefault(require("../../../utils/WXBizDataCrypt"));
var AuthProto_1 = __importDefault(require("../../protocol/protofile/AuthProto"));
var WECHAT_APPID = "wxb03d15124f396116";
var WECHAT_APPSECRET = "6b0b8e0066b7e0e9b841a6b9e05b6941";
var HTTPS_WECHAT_LOGIN = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
var AuthWeChatLoginInterface = /** @class */ (function () {
    function AuthWeChatLoginInterface() {
    }
    AuthWeChatLoginInterface.do_wechat_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, logincode, wechatuserinfo, userinfoObj, obj_encryptedData_1, obj_iv_1, obj_rawData, obj_signature, obj_userInfo, wechat_login_address;
            return __generator(this, function (_a) {
                body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                logincode = body.logincode;
                wechatuserinfo = body.userlogininfo;
                if (wechatuserinfo) {
                    userinfoObj = JSON.parse(wechatuserinfo);
                    obj_encryptedData_1 = userinfoObj.encryptedData;
                    obj_iv_1 = userinfoObj.iv;
                    obj_rawData = userinfoObj.rawData;
                    obj_signature = userinfoObj.signature;
                    obj_userInfo = userinfoObj.userInfo;
                    wechat_login_address = util.format(HTTPS_WECHAT_LOGIN, WECHAT_APPID, WECHAT_APPSECRET, logincode);
                    // Log.info("hcc>>wechat_login_address: ", wechat_login_address);
                    // Log.info("hcc>>UserInfo:" , userInfo);
                    https.get(wechat_login_address, function (ret) {
                        var datas = [];
                        var size = 0;
                        ret.on("data", function (data) {
                            datas.push(data);
                            size += data.length;
                            // Log.info("hcc>>recv data, size: " , size);
                        });
                        // res中包含了openId、unionId、nickName、avatarUrl等等信息
                        // 注意，如果你的小游戏没有绑定微信公众号，这里可能也不会有unionId
                        // 微信登录完成，可以开始进入游戏了
                        ret.on("end", function () {
                            return __awaiter(this, void 0, void 0, function () {
                                var buff, result, d_result, wxCrypt, decode_data, error_1, error_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            buff = Buffer.concat(datas, size);
                                            result = iconv.decode(buff, "utf8");
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 6, , 7]);
                                            d_result = JSON.parse(result);
                                            if (!d_result.session_key) return [3 /*break*/, 5];
                                            _a.label = 2;
                                        case 2:
                                            _a.trys.push([2, 4, , 5]);
                                            wxCrypt = new WXBizDataCrypt_1["default"](WECHAT_APPID, d_result.session_key);
                                            decode_data = wxCrypt.decryptData(obj_encryptedData_1, obj_iv_1);
                                            // Log.info("hcc>>real>>res:", decode_data);
                                            return [4 /*yield*/, AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data)];
                                        case 3:
                                            // Log.info("hcc>>real>>res:", decode_data);
                                            _a.sent();
                                            return [3 /*break*/, 5];
                                        case 4:
                                            error_1 = _a.sent();
                                            Log_1["default"].error("error1", error_1);
                                            return [3 /*break*/, 5];
                                        case 5: return [3 /*break*/, 7];
                                        case 6:
                                            error_2 = _a.sent();
                                            Log_1["default"].error("error2", error_2);
                                            return [3 /*break*/, 7];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        ret.on("error", function (data) {
                            Log_1["default"].error("hcc>>error:", data);
                        });
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    AuthWeChatLoginInterface.do_login_by_wechat_unionid = function (session, utag, proto_type, decode_data) {
        return __awaiter(this, void 0, void 0, function () {
            var unionId, avatarUrl, nickName, gender, country, province, city, address, data, insert_ret, sql_info, resbody, login_uid, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unionId = decode_data.unionId;
                        avatarUrl = decode_data.avatarUrl;
                        nickName = decode_data.nickName;
                        gender = decode_data.gender;
                        country = decode_data.country;
                        province = decode_data.province;
                        city = decode_data.city;
                        if (!country) {
                            country = "unknown";
                        }
                        if (!province) {
                            province = "unknown";
                        }
                        if (!city) {
                            city = "unknown";
                        }
                        if (util.isNullOrUndefined(gender)) {
                            return [2 /*return*/];
                        }
                        if (util.isNullOrUndefined(avatarUrl) || util.isNullOrUndefined(nickName) || util.isNullOrUndefined(unionId)) {
                            // Log.warn("hcc>>do_login_by_wechat_unionid>>1111");
                            return [2 /*return*/];
                        }
                        address = country + "-" + province + "-" + city;
                        return [4 /*yield*/, MySqlAuth_1["default"].login_by_wechat_unionid(unionId)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 6];
                        if (!(data.length <= 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, MySqlAuth_1["default"].insert_wechat_user(nickName, gender, address, unionId, avatarUrl)];
                    case 2:
                        insert_ret = _a.sent();
                        if (insert_ret) {
                            AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data);
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        sql_info = data[0];
                        resbody = {
                            status: Response_1["default"].OK,
                            uid: Number(sql_info.uid),
                            userlogininfo: JSON.stringify(sql_info)
                        };
                        // Log.info("hcc>>do_login_by_wechat_unionid: ", resbody)
                        AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_WECHATLOGIN, utag, proto_type, resbody);
                        login_uid = sql_info.uid;
                        if (!login_uid) return [3 /*break*/, 5];
                        return [4 /*yield*/, MySqlAuth_1["default"].update_wechat_user_info(login_uid, nickName, gender, address, unionId, avatarUrl)];
                    case 4:
                        ret = _a.sent();
                        if (ret) {
                            Log_1["default"].info("hcc>>wechat login >> update user info success!!");
                        }
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                    case 6:
                        AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_WECHATLOGIN, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                        return [2 /*return*/];
                }
            });
        });
    };
    //微信session登录(其实就是unionid登录)
    AuthWeChatLoginInterface.do_wechat_session_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, wechatsessionkey, data, sql_info, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) return [3 /*break*/, 3];
                        wechatsessionkey = body.wechatsessionkey;
                        if (!wechatsessionkey) return [3 /*break*/, 2];
                        return [4 /*yield*/, MySqlAuth_1["default"].login_by_wechat_unionid(wechatsessionkey)];
                    case 1:
                        data = _a.sent();
                        if (data.length > 0) {
                            sql_info = data[0];
                            resbody = {
                                status: Response_1["default"].OK,
                                uid: Number(sql_info.uid),
                                userlogininfo: JSON.stringify(sql_info)
                            };
                            Log_1["default"].info("hcc>>do_wechat_session_login_req: ", resbody);
                            AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, resbody);
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return AuthWeChatLoginInterface;
}());
/*
hcc>>real>>res:decode_data: {
    openId: 'oH8dH45oVZTuPNK6hQaSeANR-F9Y',
    unionId: 'oaCkmwOd91uU-3oX78pJ59PFndGs',
    nickName: 'C小C',
    gender: 1,
    language: 'zh_CN',
    city: 'Hangzhou',
    province: 'Zhejiang',
    country: 'China',
    avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLQoDgahGVTFb6H74TZz9z5OI9RoXWmXJ6WXbWsfvWKCAD5KCdaYfdJZCf8aR0N4oP5bKXImelbkw/132',
    watermark: { timestamp: 1588006212, appid: 'wxb03d15124f396116' }
}
*/
exports["default"] = AuthWeChatLoginInterface;
//# sourceMappingURL=AuthWeChatLoginInterface.js.map