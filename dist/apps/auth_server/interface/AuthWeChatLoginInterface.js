"use strict";
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
var Log_1 = __importDefault(require("../../../utils/Log"));
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var util = __importStar(require("util"));
var https = __importStar(require("https"));
var iconv = __importStar(require("iconv-lite"));
var WXBizDataCrypt_1 = __importDefault(require("../../../utils/WXBizDataCrypt"));
var WECHAT_APPID = "wxb03d15124f396116";
var WECHAT_APPSECRET = "6b0b8e0066b7e0e9b841a6b9e05b6941";
// let http_wechat_login = "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code";
var HTTPS_WECHAT_LOGIN = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";
var AuthWeChatLoginInterface = /** @class */ (function () {
    function AuthWeChatLoginInterface() {
    }
    AuthWeChatLoginInterface.do_wechat_login_req = function (session, utag, proto_type, raw_cmd) {
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("hcc>>do_wechat_login_req:", body);
        var logincode = body.logincode;
        var wechatuserinfo = body.wechatuserinfo;
        if (wechatuserinfo) {
            var userinfoObj = JSON.parse(wechatuserinfo);
            var encryptedData_1 = userinfoObj.encryptedData;
            var iv_1 = userinfoObj.iv;
            var rawData = userinfoObj.rawData;
            var signature = userinfoObj.signature;
            var userInfo = userinfoObj.userInfo;
            var wechat_login_address = util.format(HTTPS_WECHAT_LOGIN, WECHAT_APPID, WECHAT_APPSECRET, logincode);
            Log_1["default"].info("hcc>>wechat_login_address: ", wechat_login_address);
            // Log.info("hcc>>UserInfo:" , userInfo);
            https.get(wechat_login_address, function (ret) {
                var datas = [];
                var size = 0;
                ret.on("data", function (data) {
                    datas.push(data);
                    size += data.length;
                    Log_1["default"].info("hcc>>recv data, size: ", size);
                });
                ret.on("end", function () {
                    Log_1["default"].info("hcc>>end");
                    var buff = Buffer.concat(datas, size);
                    var result = iconv.decode(buff, "utf8");
                    var d = JSON.parse(result);
                    var wxCrypt = new WXBizDataCrypt_1["default"](WECHAT_APPID, d.session_key);
                    var res = wxCrypt.decryptData(encryptedData_1, iv_1);
                    Log_1["default"].info("hcc>>real>>res:", res);
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
    return AuthWeChatLoginInterface;
}());
/*
hcc>>real>>res: {
    openId: 'oH8dH45oVZTuPNK6hQaSeANR-F9Y',
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