"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
exports.__esModule = true;
var Platform_1 = __importDefault(require("../../../utils/Platform"));
var RobotListConfig = /** @class */ (function () {
    function RobotListConfig() {
    }
    //机器人配置:[房间等级]：机器人uid
    RobotListConfig.robot_roomlevel_map = (_a = {},
        _a[1] = [1917, 1918, 1919, 1920, 1921],
        _a[2] = [1922, 1923, 1924, 1925, 1926],
        _a[3] = [1927, 1928, 1929, 1930, 1931],
        _a);
    RobotListConfig.READY_DELAY_TIME = 1500; //准备延迟时间 毫秒
    RobotListConfig.SHOOT_DELAY_TIME = 2000; //射击延迟时间
    RobotListConfig.SHOW_EMOJ_TIME = 2000; //射击延迟时间
    RobotListConfig.TOTAL_EMOJ_COUNT = 35; // 总的表情个数 35个
    return RobotListConfig;
}());
exports["default"] = RobotListConfig;
if (Platform_1["default"].isWin32()) { //测试环境
    RobotListConfig.robot_roomlevel_map = (_b = {},
        // [1]: [1921, 1922, 1923, 1924],
        // [2]: [1925, 1926, 1927],
        // [3]: [1923, 1928, 1929, 1930],
        // [1]: [1921],
        // [2]: [1925],
        _b[3] = [1923],
        _b);
}
//# sourceMappingURL=RobotListConfig.js.map