"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Log_1 = __importDefault(require("../utils/Log"));
var json_str = "{propid:1111}";
var json_obj = { propid: 111 };
// let json_str: string = "{propid=1111}";
// let json_str: string = "hhhhh:111"
// let res= JSON.stringify(json_obj);
// let resObj = JSON.parse("protid:111");
// Log.info(typeof(res) , res)
// Log.info(typeof(resObj) , resObj);
Log_1["default"].info("hcc>>this: ", this);
Log_1["default"].info("hcc>>this:222 ");
//# sourceMappingURL=jsontest.js.map