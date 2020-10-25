"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoManager_1 = __importDefault(require("../../netengine/ProtoManager"));
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var LoginRewardInterface_1 = __importDefault(require("./interface/LoginRewardInterface"));
var ShareInterface_1 = __importDefault(require("./interface/ShareInterface"));
var AddUchipInterface_1 = __importDefault(require("./interface/AddUchipInterface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var SystemProto_1 = __importDefault(require("../protocol/protofile/SystemProto"));
var SystemModel = /** @class */ (function () {
    function SystemModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION] = this.on_player_lost_connect,
            _a[SystemProto_1["default"].XY_ID.REQ_LOGINREWARDCONFIG] = this.on_user_login_reward_config,
            _a[SystemProto_1["default"].XY_ID.REQ_LOGINREWARDSIGN] = this.on_user_login_reward_sign,
            _a[SystemProto_1["default"].XY_ID.REQ_USERSHARE] = this.on_user_share_req,
            _a[SystemProto_1["default"].XY_ID.REQ_USERADDCHIP] = this.on_user_add_chip_req,
            _a);
    }
    SystemModel.getInstance = function () {
        return SystemModel.Instance;
    };
    SystemModel.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    SystemModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var ctypeName = ctype == CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION ? "UserLostConnectRes" : SystemProto_1["default"].XY_NAME[ctype];
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1["default"].S_NAME[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    SystemModel.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    SystemModel.prototype.on_user_login_reward_config = function (session, utag, proto_type, raw_cmd) {
        LoginRewardInterface_1["default"].do_user_login_reward_config(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_login_reward_sign = function (session, utag, proto_type, raw_cmd) {
        LoginRewardInterface_1["default"].do_user_login_reward_sign(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_share_req = function (session, utag, proto_type, raw_cmd) {
        ShareInterface_1["default"].dn_user_share_req(session, utag, proto_type, raw_cmd);
    };
    SystemModel.prototype.on_user_add_chip_req = function (session, utag, proto_type, raw_cmd) {
        AddUchipInterface_1["default"].do_user_add_chip_req(session, utag, proto_type, raw_cmd);
    };
    SystemModel.Instance = new SystemModel();
    return SystemModel;
}());
exports["default"] = SystemModel;
//# sourceMappingURL=SystemModel.js.map