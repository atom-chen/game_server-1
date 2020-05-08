"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var util = __importStar(require("util"));
var test_string = "hcc>>%d_%s";
var ret = util.format(test_string, 111111, "hcccccccccccccccc");
console.log(ret);
console.log("hcc>> ", !0);
//# sourceMappingURL=utiltest.js.map