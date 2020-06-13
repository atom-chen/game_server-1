"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var AuthProto_1 = require("../protocol/AuthProto");
var Response_1 = __importDefault(require("../protocol/Response"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var AuthSendMsg_1 = __importDefault(require("./AuthSendMsg"));
var CommonProto_1 = __importDefault(require("../protocol/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var AuthInfoInterface_1 = __importDefault(require("./interface/AuthInfoInterface"));
var AuthLoginInterface_1 = __importDefault(require("./interface/AuthLoginInterface"));
var AuthRegistInterface_1 = __importDefault(require("./interface/AuthRegistInterface"));
var Stype_1 = require("../protocol/Stype");
var AuthWeChatLoginInterface_1 = __importDefault(require("./interface/AuthWeChatLoginInterface"));
var AuthModel = /** @class */ (function () {
    function AuthModel() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].eUserLostConnectRes] = this.on_player_lost_connect,
            _a[AuthProto_1.Cmd.eUnameLoginReq] = this.on_uname_login_req,
            _a[AuthProto_1.Cmd.eGuestLoginReq] = this.on_guest_login_req,
            _a[AuthProto_1.Cmd.eUnameRegistReq] = this.on_uname_regist_req,
            _a[AuthProto_1.Cmd.eLoginOutReq] = this.on_login_out_req,
            _a[AuthProto_1.Cmd.eGetUserCenterInfoReq] = this.on_get_user_center_info_req,
            _a[AuthProto_1.Cmd.eWeChatLoginReq] = this.on_wechat_login_req,
            _a[AuthProto_1.Cmd.eWeChatSessionLoginReq] = this.on_wechat_session_login_req,
            _a[AuthProto_1.Cmd.ePhoneRegistReq] = function () { },
            _a[AuthProto_1.Cmd.eGetPhoneRegVerNumReq] = function () { },
            _a[AuthProto_1.Cmd.eBindPhoneNumberReq] = function () { },
            _a[AuthProto_1.Cmd.eResetUserPwdReq] = function () { },
            _a[AuthProto_1.Cmd.eEditProfileReq] = function () { },
            _a[AuthProto_1.Cmd.eAccountUpgradeReq] = function () { },
            _a[AuthProto_1.Cmd.eReloginRes] = function () { },
            _a);
    }
    AuthModel.getInstance = function () {
        return AuthModel.Instance;
    };
    AuthModel.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    AuthModel.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        // Log.info("recv_cmd_msg: ", stype, ctype, utag, proto_type, ProtoManager.decode_cmd(proto_type, raw_cmd))
        var ctypeName = ctype == CommonProto_1["default"].eUserLostConnectRes ? "UserLostConnectRes" : AuthProto_1.CmdName[ctype];
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1.StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    AuthModel.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("on_player_lost_connect utag:", utag, body);
    };
    AuthModel.prototype.on_uname_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthLoginInterface_1["default"].do_uname_login_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.prototype.on_guest_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthLoginInterface_1["default"].do_guest_login_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.prototype.on_uname_regist_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameRegistRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthRegistInterface_1["default"].do_uname_regist_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.prototype.on_get_user_center_info_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGetUserCenterInfoRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthInfoInterface_1["default"].do_get_user_center_info_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.prototype.on_login_out_req = function (session, utag, proto_type, raw_cmd) {
        if (utag == 0) {
            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eLoginOutRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
            return;
        }
        AuthLoginInterface_1["default"].do_login_out_req(session, utag, proto_type, raw_cmd);
    };
    AuthModel.prototype.on_wechat_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eWeChatLoginRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthWeChatLoginInterface_1["default"].do_wechat_login_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.prototype.on_wechat_session_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eWeChatSessionLoginRes, utag, proto_type, { status: Response_1["default"].ILLEGAL_ACCOUNT });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, AuthWeChatLoginInterface_1["default"].do_wechat_session_login_req(session, utag, proto_type, raw_cmd)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthModel.Instance = new AuthModel();
    return AuthModel;
}());
exports["default"] = AuthModel;
//# sourceMappingURL=AuthModel.js.map