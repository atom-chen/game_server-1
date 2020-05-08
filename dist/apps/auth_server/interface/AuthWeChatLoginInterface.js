"use strict";
// 微信小程序登录
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
var AuthProto_1 = require("../../protocol/AuthProto");
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var util = __importStar(require("util"));
var https = __importStar(require("https"));
var iconv = __importStar(require("iconv-lite"));
var WXBizDataCrypt_1 = __importDefault(require("../../../utils/WXBizDataCrypt"));
var WECHAT_APPID = "wxb03d15124f396116";
var WECHAT_APPSECRET = "6b0b8e0066b7e0e9b841a6b9e05b6941";
var HTTPS_WECHAT_LOGIN = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
var AuthWeChatLoginInterface = /** @class */ (function () {
    function AuthWeChatLoginInterface() {
    }
    AuthWeChatLoginInterface.do_wechat_login_req = function (session, utag, proto_type, raw_cmd) {
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        // Log.info("hcc>>do_wechat_login_req:" , body);
        var logincode = body.logincode;
        var wechatuserinfo = body.wechatuserinfo;
        if (wechatuserinfo) {
            var userinfoObj = JSON.parse(wechatuserinfo);
            var obj_encryptedData_1 = userinfoObj.encryptedData;
            var obj_iv_1 = userinfoObj.iv;
            var obj_rawData = userinfoObj.rawData;
            var obj_signature = userinfoObj.signature;
            var obj_userInfo = userinfoObj.userInfo;
            var wechat_login_address = util.format(HTTPS_WECHAT_LOGIN, WECHAT_APPID, WECHAT_APPSECRET, logincode);
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
                ret.on("end", function () {
                    var buff = Buffer.concat(datas, size);
                    var result = iconv.decode(buff, "utf8");
                    try {
                        var d_result = JSON.parse(result);
                        if (d_result.session_key) {
                            try {
                                var wxCrypt = new WXBizDataCrypt_1["default"](WECHAT_APPID, d_result.session_key);
                                var decode_data = wxCrypt.decryptData(obj_encryptedData_1, obj_iv_1);
                                Log_1["default"].info("hcc>>real>>res:", decode_data);
                                AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data);
                            }
                            catch (error) {
                                Log_1["default"].error("error1", error);
                            }
                        }
                    }
                    catch (error) {
                        Log_1["default"].error("error2", error);
                    }
                    // res中包含了openId、unionId、nickName、avatarUrl等等信息
                    // 注意，如果你的小游戏没有绑定微信公众号，这里可能也不会有unionId
                    // 微信登录完成，可以开始进入游戏了
                });
                ret.on("error", function (data) {
                    Log_1["default"].error("hcc>>error:", data);
                });
            });
        }
    };
    AuthWeChatLoginInterface.do_login_by_wechat_unionid = function (session, utag, proto_type, decode_data) {
        var unionId = decode_data.unionId;
        var avatarUrl = decode_data.avatarUrl;
        var nickName = decode_data.nickName;
        var gender = decode_data.gender;
        var country = decode_data.country;
        var province = decode_data.province;
        var city = decode_data.city;
        if (!country) {
            country = "unknown";
        }
        if (!province) {
            province = "unknown";
        }
        if (!city) {
            city = "unknown";
        }
        if (gender == undefined || gender == NaN) {
            return;
        }
        if (!avatarUrl || !nickName || !unionId) {
            Log_1["default"].warn("hcc>>do_login_by_wechat_unionid>>1111");
            return;
        }
        var address = country + "-" + province + "-" + city;
        MySqlAuth_1["default"].login_by_wechat_unionid(unionId, function (status, data) {
            if (status == Response_1["default"].OK) {
                if (data.length <= 0) {
                    Log_1["default"].warn("hcc>>do_login_by_wechat_unionid>>2222");
                    MySqlAuth_1["default"].insert_wechat_user(nickName, gender, address, unionId, avatarUrl, function (status, data) {
                        if (status == Response_1["default"].OK) {
                            Log_1["default"].warn("hcc>>do_login_by_wechat_unionid>>3333");
                            AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data);
                        }
                        else {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eWeChatLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            Log_1["default"].warn("hcc>>do_login_by_wechat_unionid>>4444");
                        }
                    });
                }
                else {
                    var sql_info = data[0];
                    var resbody = {
                        status: 1,
                        uid: sql_info.uid,
                        wechatuserinfo: JSON.stringify(sql_info)
                    };
                    Log_1["default"].info("hcc>>do_login_by_wechat_unionid: ", resbody);
                    AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eWeChatLoginRes, utag, proto_type, resbody);
                    //登录成功后，立即更新玩家微信数据，可能会耗费IO，但是为了同步微信信息没办法
                    var login_uid = sql_info.uid;
                    if (login_uid) {
                        MySqlAuth_1["default"].update_wechat_user_info(login_uid, nickName, gender, address, unionId, avatarUrl, function (status, data) {
                            if (status == Response_1["default"].OK) {
                                Log_1["default"].info("hcc>>wechat login >> update user info success!!");
                            }
                        });
                    }
                }
            }
            else {
                AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eWeChatLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
            }
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