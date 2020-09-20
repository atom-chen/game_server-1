"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var CryptoUtil_1 = __importDefault(require("../utils/CryptoUtil"));
var Log_1 = __importDefault(require("../utils/Log"));
var strtest = "192.168.31.181:6937";
var en_str = CryptoUtil_1["default"].base64_encode(strtest);
var den_str = CryptoUtil_1["default"].base64_decode(en_str);
Log_1["default"].info("base64 : ", en_str);
// Log.info("den_str: ", den_str)
// let md5_str = CryptoUtil.md5(strtest)
// let sha1_str = CryptoUtil.sha1(strtest)
// Log.info("md5: ", md5_str)
// Log.info("sha1: ", sha1_str)
/**
 *
 base64:  MTkyLjE2OC4zMS4xODE6NjkzNw==
 md5:  960cf2fb01454e4f4dcc772123c573c7
 sha1: 1f9ac6ea107849e2ca2fe322d62b8022852756aa
 */
var crypto = require("crypto"); //导入其他库
// var sha1: crypto.Hash = crypto.createHash("sha1", { outputLength: 40 });
var sha1 = crypto.createHash("sha1");
sha1.update(strtest);
var result = sha1.digest('hex');
Log_1["default"].info("aaa>>: ", result);
//# sourceMappingURL=encrypt_test.js.map