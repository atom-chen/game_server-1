"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Response_1 = __importDefault(require("../protocol/Response"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = require("../protocol/Stype");
var SystemProto_1 = require("../protocol/SystemProto");
var SystemSend_1 = __importDefault(require("./SystemSend"));
var LoginRewardInterface_1 = __importDefault(require("./interface/LoginRewardInterface"));
var ShareInterface_1 = __importDefault(require("./interface/ShareInterface"));
var AddUchipInterface_1 = __importDefault(require("./interface/AddUchipInterface"));
var SystemModel = /** @class */ (function () {
    function SystemModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].eUserLostConnectRes] = this.on_player_lost_connect,
            _a[SystemProto_1.Cmd.eLoginRewardConfigReq] = this.on_user_login_reward_config,
            _a[SystemProto_1.Cmd.eLoginRewardSignReq] = this.on_user_login_reward_sign,
            _a[SystemProto_1.Cmd.eUserShareReq] = this.on_user_share_req,
            _a[SystemProto_1.Cmd.eUserAddChipReq] = this.on_user_add_chip_req,
            _a);
    }
    SystemModel.getInstance = function () {
        return SystemModel.Instance;
    };
    SystemModel.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    SystemModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var ctypeName = ctype == CommonProto_1["default"].eUserLostConnectRes ? "UserLostConnectRes" : SystemProto_1.CmdName[ctype];
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1.StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    SystemModel.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("on_player_lost_connect utag:", utag, body);
    };
    SystemModel.prototype.on_user_login_reward_config = function (session, utag, proto_type, raw_cmd) {
        if (utag == 0) {
            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardConfigRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        LoginRewardInterface_1["default"].do_user_login_reward_config(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_login_reward_sign = function (session, utag, proto_type, raw_cmd) {
        if (utag == 0) {
            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eLoginRewardSignRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        LoginRewardInterface_1["default"].do_user_login_reward_sign(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_share_req = function (session, utag, proto_type, raw_cmd) {
        if (utag == 0) {
            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserShareRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        ShareInterface_1["default"].dn_user_share_req(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_add_chip_req = function (session, utag, proto_type, raw_cmd) {
        if (utag == 0) {
            SystemSend_1["default"].send(session, SystemProto_1.Cmd.eUserAddChipRes, utag, proto_type, { status: Response_1["default"].INVALIDI_OPT });
            return;
        }
        AddUchipInterface_1["default"].do_user_add_chip_req(session, utag, proto_type, raw_cmd);
    };
    SystemModel.Instance = new SystemModel();
    return SystemModel;
}());
exports["default"] = SystemModel;
//# sourceMappingURL=SystemModel.js.map