"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
// let https = require("https");
var https = __importStar(require("https"));
https.get("https://www.baidu.com", function (data) {
    console.log("hcc>>data: ", data);
});
// http.get('http://www.hccfun.com/', (res) => {
//     console.log('状态码:', res.statusCode);
//     console.log('请求头:', res.headers);
//     res.on('data', (d) => {
//         process.stdout.write(d);
//     });
// }).on('error', (e) => {
//     console.error(e);
// });
//# sourceMappingURL=http_get_test.js.map