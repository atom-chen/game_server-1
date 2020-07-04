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
    RobotListConfig.READY_DELAY_TIME = 1500; //准备延迟时间 毫秒
    RobotListConfig.SHOOT_DELAY_TIME = 2000; //射击延迟时间
    RobotListConfig.SHOW_EMOJ_TIME = 2000; //表情发送延迟时间
    RobotListConfig.TOTAL_EMOJ_COUNT = 35; // 总的表情个数 35个
    //机器人配置:[房间等级]：机器人uid
    RobotListConfig.robot_roomlevel_map = (_a = {},
        _a[1911] = { guestkey: "TnhSy7aP7TkK7MN2rppYTs2aKM6jicF7", roomlevel: 1 },
        _a[1912] = { guestkey: "nM5irPKdfYX6dJP8RPJKR5G6f7ZGx2pe", roomlevel: 1 },
        _a[1913] = { guestkey: "C4wkp84z4TbMJbmfyaYmYcCW2em43Biz", roomlevel: 1 },
        _a[1914] = { guestkey: "pfhndH8A6ebMM225p5kdMn5sDeK2xNsF", roomlevel: 1 },
        _a[1917] = { guestkey: "HdGt5d73rWwQ2DwYMwEXSPGEtpyFPPH3", roomlevel: 1 },
        _a[1918] = { guestkey: "pznEXfB3xTJXR5M7AXSw74sM3GWNCQkd", roomlevel: 1 },
        _a[1919] = { guestkey: "i5aANJrF5tDQHJYS8knZJJBEx3Amw4Bd", roomlevel: 1 },
        _a[1920] = { guestkey: "xxPipwADGPHJnsDxsJDYQysDD28WxSWZ", roomlevel: 1 },
        _a[1921] = { guestkey: "TREGmnW3tBsDhbBHy5YJZ5RdZZZC7QSJ", roomlevel: 1 },
        _a[1922] = { guestkey: "XQBAdph5wnXEJX4z838Nef6He2kaMGAP", roomlevel: 1 },
        _a[1923] = { guestkey: "TD7z3WdpTCH2i2Cc8sYhQaWa6fJJrHHJ", roomlevel: 2 },
        _a[1924] = { guestkey: "pBGsjKnyG6yWrYRpe244mJi8fizAMHzC", roomlevel: 2 },
        _a[1925] = { guestkey: "skNPcfbbJpFfxtsEsa7abhWHC7jGEED7", roomlevel: 2 },
        _a[1927] = { guestkey: "szd3mTZK4N3MYztaEE3XY2f2xcF6f6AB", roomlevel: 2 },
        _a[1928] = { guestkey: "ADG72Kn4rGcMwFRsGpEeS3zKPa3PpaYk", roomlevel: 2 },
        _a[1929] = { guestkey: "j4HHRRGHpSSwKnYDkDMns7rBZPezKXhX", roomlevel: 3 },
        _a[1930] = { guestkey: "rbZ5PykwYrTHT358tZaSNW4bQTi8mQGj", roomlevel: 3 },
        _a[1931] = { guestkey: "rSPHztFfZ3mSGs3j7ZtjhxDG7wHADrAb", roomlevel: 3 },
        _a[1932] = { guestkey: "DstG7e4A7ySQTFtZw5CKFa3XsPXMmtf5", roomlevel: 3 },
        _a[1934] = { guestkey: "Bha8pZjBH6zyyzXRt3ZGbNf4Z8sTkZyN", roomlevel: 3 },
        _a);
    return RobotListConfig;
}());
exports["default"] = RobotListConfig;
if (Platform_1["default"].isWin32()) { //测试环境
    RobotListConfig.robot_roomlevel_map = (_b = {},
        _b[1921] = { guestkey: "rbZ5PykwYrTHT358tZaSNW4bQTi8mQGj", roomlevel: 1 },
        _b[1922] = { guestkey: "HdGt5d73rWwQ2DwYMwEXSPGEtpyFPPH3", roomlevel: 1 },
        _b[1923] = { guestkey: "SsBnkJ57hBh4PM4DZXeQASECTksY3iD8", roomlevel: 1 },
        _b[1924] = { guestkey: "cmrPArdnfztTnPAG7KD3GJeN8kCwMt6n", roomlevel: 1 },
        _b[1925] = { guestkey: "823pB8npb2A452Dy5eNWHPXid8T35JMe", roomlevel: 2 },
        _b[1926] = { guestkey: "eZn5t5xkc24ey7fccSy3ZZZZG7k62myA", roomlevel: 2 },
        _b[1927] = { guestkey: "ancAhnEZMYBXyHeGwsH7PMKGdSBf3xN5", roomlevel: 2 },
        _b[1928] = { guestkey: "MBB4WD3mpAjAim746BMxhQixH24YrtCh", roomlevel: 3 },
        _b[1929] = { guestkey: "kGrBw2cJPjrBMcJzX6keSTr8iafWKEap", roomlevel: 3 },
        _b[1930] = { guestkey: "5EjmJctzYmbsdish8XX7mKMBs2ydnrQB", roomlevel: 3 },
        _b);
}
//# sourceMappingURL=RobotListConfig.js.map