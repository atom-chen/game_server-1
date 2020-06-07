"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var SystemSend_1 = __importDefault(require("../SystemSend"));
var MysqlSystem_1 = __importDefault(require("../../../database/MysqlSystem"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var SystemProto_1 = require("../../protocol/SystemProto");
var Log_1 = __importDefault(require("../../../utils/Log"));
var LoginRewardConfig_1 = require("../config/LoginRewardConfig");
var ArrayUtil_1 = __importDefault(require("../../../utils/ArrayUtil"));
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var TimeUtil_1 = __importDefault(require("../../../utils/TimeUtil"));
var MySqlGame_1 = __importDefault(require("../../../database/MySqlGame"));
var bonues_max_days = 7; //连续签到最大天数
var LoginRewardInterface = /** @class */ (function () {
    function LoginRewardInterface() {
    }
    LoginRewardInterface.do_user_login_reward_config = function (session, utag, proto_type, raw_cmd) {
        MysqlSystem_1["default"].get_login_bonues_info_by_uid(utag, function (status, data) {
            if (status == Response_1["default"].OK) {
                if (data.length <= 0) {
                    MysqlSystem_1["default"].insert_login_bonues_info(utag, 0, 0, 0, 0, function (ins_status, ins_data) {
                        if (ins_status != Response_1["default"].OK) {
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return;
                        }
                        LoginRewardInterface.do_user_login_reward_config(session, utag, proto_type, raw_cmd);
                    });
                }
                else {
                    var sql_info = data[0];
                    var bonues_days = sql_info.days; //已签到天数
                    var bonues_time = sql_info.bonues_time;
                    var config = ArrayUtil_1["default"].ObjClone(LoginRewardConfig_1.LoginRewardConfig);
                    for (var day in config) {
                        var config_obj = config[day];
                        var day_index = Number(day); //当前天数下标
                        if (day_index <= bonues_days) {
                            config_obj["isget"] = true;
                            config_obj["canget"] = false;
                        }
                        if ((day_index == (bonues_days + 1) % bonues_max_days)) {
                            if (bonues_time == 0 || bonues_time != TimeUtil_1["default"].timestamp_today()) {
                                config_obj["isget"] = false;
                                config_obj["canget"] = true;
                            }
                        }
                    }
                    var istodaysign = bonues_time == TimeUtil_1["default"].timestamp_today();
                    var resbody = {
                        status: 1,
                        signdays: bonues_days,
                        istodaysign: istodaysign,
                        config: JSON.stringify(config)
                    };
                    Log_1["default"].info("hcc>>do_user_login_reward_config: ", resbody);
                    SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, resbody);
                }
            }
            else {
                SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
            }
        });
    };
    LoginRewardInterface.do_user_login_reward_sign = function (session, utag, proto_type, raw_cmd) {
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (body) {
            var signofday_1 = body.signofday;
            var time_now_1 = TimeUtil_1["default"].timestamp_today();
            MysqlSystem_1["default"].get_login_bonues_info_by_uid(utag, function (status, data) {
                if (status == Response_1["default"].OK) {
                    if (data.length > 0) {
                        var data_obj = data[0];
                        var bonues_time = data_obj.bonues_time;
                        var days = data_obj.days;
                        var days_now = (days + 1) % bonues_max_days;
                        Log_1["default"].info("hcc>>do_user_login_reward_sign bonues_info: ", data);
                        if (bonues_time != time_now_1 && signofday_1 == days_now) { // can sign
                            MysqlSystem_1["default"].update_login_bonues_info(utag, 0, time_now_1, days_now, 1, function (bonues_stauts, bonues_data) {
                                if (bonues_stauts == Response_1["default"].OK) {
                                    //增加玩家金币
                                    var propcount = LoginRewardConfig_1.LoginRewardConfig[signofday_1].propcount;
                                    if (propcount) {
                                        MySqlGame_1["default"].add_ugame_uchip(utag, propcount); //增加玩家金币
                                        var rewardObj = {
                                            propid: LoginRewardConfig_1.LoginRewardConfig[signofday_1].propid,
                                            propcount: LoginRewardConfig_1.LoginRewardConfig[signofday_1].propcount
                                        };
                                        var resbody = {
                                            status: Response_1["default"].OK,
                                            rewardconfig: JSON.stringify(rewardObj)
                                        };
                                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, resbody);
                                        Log_1["default"].info("hcc>>do_user_login_reward_sign success ", resbody);
                                    }
                                }
                                else {
                                    SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                                    Log_1["default"].info("hcc>>do_user_login_reward_sign failed 111");
                                }
                            });
                        }
                        else {
                            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                            Log_1["default"].info("hcc>>do_user_login_reward_sign failed 222");
                        }
                    }
                    else {
                        SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
                        Log_1["default"].info("hcc>>do_user_login_reward_sign failed 333");
                    }
                }
            });
        }
    };
    return LoginRewardInterface;
}());
exports["default"] = LoginRewardInterface;
//# sourceMappingURL=LoginRewardInterface.js.map