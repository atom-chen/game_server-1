"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var https = __importStar(require("https"));
var http = __importStar(require("http"));
var querystring_1 = __importDefault(require("querystring"));
var util = __importStar(require("util"));
var Log_1 = __importDefault(require("./Log"));
var HttpUtil = /** @class */ (function () {
    function HttpUtil() {
    }
    HttpUtil.post = function (host, port, path, data, callback) {
        var content = querystring_1["default"].stringify(data);
        var options = {
            hostname: host,
            port: port,
            path: path + '?' + content,
            method: 'GET'
        };
        var req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                callback(chunk);
            });
        });
        req.on('error', function (e) {
            Log_1["default"].error('problem with request: ' + e.message);
        });
        req.end();
    };
    HttpUtil.get = function (host, port, path, data, callback, safe) {
        var content = querystring_1["default"].stringify(data);
        var options = {
            hostname: host,
            path: path + '?' + content,
            method: 'GET',
            port: port
        };
        safe = util.isNullOrUndefined(safe) ? false : true;
        var proto = http;
        if (safe) {
            proto = https;
        }
        var req = proto.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                try {
                    var json = JSON.parse(chunk);
                    callback(true, json);
                }
                catch (error) {
                    Log_1["default"].error(error);
                }
            });
        });
        req.on('error', function (e) {
            Log_1["default"].error('problem with request: ' + e.message);
            callback(false, e);
        });
        req.end();
    };
    ;
    HttpUtil.get2 = function (url, data, callback, safe) {
        var content = querystring_1["default"].stringify(data);
        url = url + '?' + content;
        var proto = http;
        safe = util.isNullOrUndefined(safe) ? false : true;
        if (safe) {
            proto = https;
        }
        var req = proto.get(url, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                try {
                    var json = JSON.parse(chunk);
                    callback(true, json);
                }
                catch (error) {
                    Log_1["default"].error(error);
                }
            });
        });
        req.on('error', function (e) {
            Log_1["default"].error('problem with request: ' + e.message);
            callback(false, e);
        });
        req.end();
    };
    ;
    return HttpUtil;
}());
exports["default"] = HttpUtil;
//# sourceMappingURL=httpUtil.js.map