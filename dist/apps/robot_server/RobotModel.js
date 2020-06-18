"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = require("../protocol/Stype");
var RobotProto_1 = require("../protocol/RobotProto");
var RobotModel = /** @class */ (function () {
    function RobotModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[RobotProto_1.Cmd.eLoginLogicRes] = this.on_player_login_logic_res,
            _a);
    }
    RobotModel.getInstance = function () {
        return RobotModel.Instance;
    };
    RobotModel.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    RobotModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1.StypeName[stype], " ,cmdName: ", RobotProto_1.CmdName[ctype], " ,utag: ", utag, " ,data:", this.decode_cmd(proto_type, raw_cmd));
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    RobotModel.prototype.on_player_login_logic_res = function (session, utag, proto_type, raw_cmd) {
        Log_1["default"].info("hcc>>on_player_login_logic_res.....");
    };
    RobotModel.Instance = new RobotModel();
    return RobotModel;
}());
exports["default"] = RobotModel;
//# sourceMappingURL=RobotModel.js.map