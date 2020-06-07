"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var TimeUtil_1 = __importDefault(require("../utils/TimeUtil"));
var daystr = TimeUtil_1["default"].timestamp();
console.log("timestamp: ", daystr);
daystr = TimeUtil_1["default"].timestamp_today();
console.log("timestamp_today: ", daystr);
daystr = TimeUtil_1["default"].timestamp_yesterday();
console.log("timestamp_yesterday: ", daystr);
daystr = TimeUtil_1["default"].get_cur_time();
console.log("get_cur_time: ", daystr);
//# sourceMappingURL=test_datautil.js.map