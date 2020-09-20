"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Response_1 = __importDefault(require("../protocol/Response"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var Log_1 = __importDefault(require("../../utils/Log"));
var RobotGameInterface_1 = __importDefault(require("./interface/RobotGameInterface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var AuthProto_1 = __importDefault(require("../protocol/protofile/AuthProto"));
var RobotAuthModel = /** @class */ (function () {
    function RobotAuthModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[AuthProto_1["default"].XY_ID.REQ_GUESTLOGIN] = this.on_guest_login_auth_res,
            _a);
    }
    RobotAuthModel.getInstance = function () {
        return RobotAuthModel.Instance;
    };
    RobotAuthModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1["default"].S_NAME[stype], " ,cmdName: ", AuthProto_1["default"].XY_NAME[ctype], " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    RobotAuthModel.prototype.on_guest_login_auth_res = function (session, utag, proto_type, raw_cmd) {
        Log_1["default"].info("hcc>>on_guest_login_auth_res.....,utag: ", utag);
        var body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
        if (body) {
            var status_1 = body.status;
            if (Response_1["default"].OK == status_1) {
                RobotGameInterface_1["default"].robot_login_logic_server(session, utag);
            }
            else {
                Log_1["default"].info("hcc>>on_guest_login_auth_res login auth failed..");
            }
        }
    };
    RobotAuthModel.Instance = new RobotAuthModel();
    return RobotAuthModel;
}());
exports["default"] = RobotAuthModel;
//# sourceMappingURL=RobotAuthModel.js.map