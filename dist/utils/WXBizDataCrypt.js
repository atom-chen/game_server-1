"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var crypto_1 = __importDefault(require("crypto"));
var Log_1 = __importDefault(require("./Log"));
var WXBizDataCrypt = /** @class */ (function () {
    function WXBizDataCrypt(appId, sessionKey) {
        this.appId = "";
        this.sessionKey = "";
        this.appId = appId;
        this.sessionKey = sessionKey;
    }
    WXBizDataCrypt.prototype.decryptData = function (encryptedData, iv) {
        // base64 decode
        var session_key = new Buffer(this.sessionKey, 'base64');
        var encrypt_data = new Buffer(encryptedData, 'base64');
        var iv_data = new Buffer(iv, 'base64');
        var decoded = null;
        try {
            // 解密
            var decipher = crypto_1["default"].createDecipheriv('aes-128-cbc', session_key, iv_data);
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true);
            decoded = decipher.update(encrypt_data, 'binary', 'utf8');
            decoded += decipher.final('utf8');
            decoded = JSON.parse(decoded);
        }
        catch (err) {
            Log_1["default"].error('hcc>> Illegal Buffer 111', err);
        }
        if (decoded && decoded.watermark && decoded.watermark.appid !== this.appId) {
            Log_1["default"].error('hcc>> Illegal Buffer 222');
        }
        return decoded;
    };
    return WXBizDataCrypt;
}());
exports["default"] = WXBizDataCrypt;
/*
//使用

var WXBizDataCrypt = require('./WXBizDataCrypt')

var appId = 'wx4f4bc4dec97d474b'
var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
var encryptedData =
    'CiyLU1Aw2KjvrjMdj8YKliAjtP4gsMZM'+
    'QmRzooG2xrDcvSnxIMXFufNstNGTyaGS'+
    '9uT5geRa0W4oTOb1WT7fJlAC+oNPdbB+'+
    '3hVbJSRgv+4lGOETKUQz6OYStslQ142d'+
    'NCuabNPGBzlooOmB231qMM85d2/fV6Ch'+
    'evvXvQP8Hkue1poOFtnEtpyxVLW1zAo6'+
    '/1Xx1COxFvrc2d7UL/lmHInNlxuacJXw'+
    'u0fjpXfz/YqYzBIBzD6WUfTIF9GRHpOn'+
    '/Hz7saL8xz+W//FRAUid1OksQaQx4CMs'+
    '8LOddcQhULW4ucetDf96JcR3g0gfRK4P'+
    'C7E/r7Z6xNrXd2UIeorGj5Ef7b1pJAYB'+
    '6Y5anaHqZ9J6nKEBvB4DnNLIVWSgARns'+
    '/8wR2SiRS7MNACwTyrGvt9ts8p12PKFd'+
    'lqYTopNHR1Vf7XjfhQlVsAJdNiKdYmYV'+
    'oKlaRv85IfVunYzO0IKXsyl7JCUjCpoG'+
    '20f0a04COwfneQAGGwd5oa+T8yO5hzuy'+
    'Db/XcxxmK01EpqOyuxINew=='
var iv = 'r7BXXKkLb8qrSNn05n0qiA=='

var pc = new WXBizDataCrypt(appId, sessionKey)

var data = pc.decryptData(encryptedData , iv)

console.log('解密后 data: ', data)
// 解密后的数据为
//
// data = {
//   "nickName": "Band",
//   "gender": 1,
//   "language": "zh_CN",
//   "city": "Guangzhou",
//   "province": "Guangdong",
//   "country": "CN",
//   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//   "watermark": {
//     "timestamp": 1477314187,
//     "appid": "wx4f4bc4dec97d474b"
//   }
// }

*/ 
//# sourceMappingURL=WXBizDataCrypt.js.map