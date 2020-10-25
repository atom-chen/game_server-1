"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var CommonProto_1 = __importDefault(require("../protocol/protofile/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var AuthInfoInterface_1 = __importDefault(require("./interface/AuthInfoInterface"));
var AuthLoginInterface_1 = __importDefault(require("./interface/AuthLoginInterface"));
var AuthRegistInterface_1 = __importDefault(require("./interface/AuthRegistInterface"));
var AuthWeChatLoginInterface_1 = __importDefault(require("./interface/AuthWeChatLoginInterface"));
var Stype_1 = __importDefault(require("../protocol/Stype"));
var AuthProto_1 = __importDefault(require("../protocol/protofile/AuthProto"));
var AuthModel = /** @class */ (function () {
    function AuthModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION] = this.on_player_lost_connect,
            _a[AuthProto_1["default"].XY_ID.REQ_UNAMELOGIN] = this.on_uname_login_req,
            _a[AuthProto_1["default"].XY_ID.REQ_GUESTLOGIN] = this.on_guest_login_req,
            _a[AuthProto_1["default"].XY_ID.REQ_UNAMEREGIST] = this.on_uname_regist_req,
            _a[AuthProto_1["default"].XY_ID.REQ_LOGINOUT] = this.on_login_out_req,
            _a[AuthProto_1["default"].XY_ID.REQ_USERCENTERINFO] = this.on_get_user_center_info_req,
            _a[AuthProto_1["default"].XY_ID.REQ_WECHATLOGIN] = this.on_wechat_login_req,
            _a[AuthProto_1["default"].XY_ID.REQ_WECHATSESSIONLOGIN] = this.on_wechat_session_login_req,
            _a);
    }
    AuthModel.getInstance = function () {
        return AuthModel.Instance;
    };
    AuthModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var ctypeName = ctype == CommonProto_1["default"].XY_ID.PUSH_USERLOSTCONNECTION ? "UserLostConnectRes" : AuthProto_1["default"].XY_NAME[ctype];
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1["default"].S_NAME[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    AuthModel.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
    };
    AuthModel.prototype.on_uname_login_req = function (session, utag, proto_type, raw_cmd) {
        AuthLoginInterface_1["default"].do_uname_login_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_guest_login_req = function (session, utag, proto_type, raw_cmd) {
        AuthLoginInterface_1["default"].do_guest_login_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_uname_regist_req = function (session, utag, proto_type, raw_cmd) {
        AuthRegistInterface_1["default"].do_uname_regist_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_get_user_center_info_req = function (session, utag, proto_type, raw_cmd) {
        AuthInfoInterface_1["default"].do_get_user_center_info_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_login_out_req = function (session, utag, proto_type, raw_cmd) {
        AuthLoginInterface_1["default"].do_login_out_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_wechat_login_req = function (session, utag, proto_type, raw_cmd) {
        AuthWeChatLoginInterface_1["default"].do_wechat_login_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_wechat_session_login_req = function (session, utag, proto_type, raw_cmd) {
        AuthWeChatLoginInterface_1["default"].do_wechat_session_login_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.Instance = new AuthModel();
    return AuthModel;
}());
exports["default"] = AuthModel;
//# sourceMappingURL=AuthModel.js.map