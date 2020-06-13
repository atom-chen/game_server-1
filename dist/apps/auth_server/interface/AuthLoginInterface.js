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
var MySqlAuth_1 = __importDefault(require("../../../database/MySqlAuth"));
var Response_1 = __importDefault(require("../../protocol/Response"));
var Log_1 = __importDefault(require("../../../utils/Log"));
var AuthSendMsg_1 = __importDefault(require("../AuthSendMsg"));
var AuthProto_1 = require("../../protocol/AuthProto");
var ProtoManager_1 = __importDefault(require("../../../netbus/ProtoManager"));
var StringUtil_1 = __importDefault(require("../../../utils/StringUtil"));
var AuthLoginInterface = /** @class */ (function () {
    function AuthLoginInterface() {
    }
    AuthLoginInterface.do_uname_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, data, sql_info, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        if (!body.uname || !body.upwd) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        if (body.uname.length < 6 || body.upwd.length < 6) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySqlAuth_1["default"].login_by_uname_upwd(body.uname, body.upwd)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            if (data.length > 0) {
                                sql_info = data[0];
                                resbody = {
                                    status: 1,
                                    uid: sql_info.uid,
                                    userlogininfo: JSON.stringify(sql_info)
                                };
                                AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, resbody);
                                return [2 /*return*/];
                            }
                        }
                        AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eUnameLoginRes, utag, proto_type, { status: Response_1["default"].UNAME_OR_UPWD_ERR });
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthLoginInterface.do_guest_login_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var body, data, unick, usex, uface, insert_ret, sql_info, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
                        if (!body) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        if (!body.guestkey) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        if (body.guestkey.length < 32) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, { status: Response_1["default"].INVALID_PARAMS });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySqlAuth_1["default"].login_by_guestkey(body.guestkey)];
                    case 1:
                        data = _a.sent();
                        if (!data) return [3 /*break*/, 4];
                        if (!(data.length <= 0)) return [3 /*break*/, 3];
                        unick = "gst";
                        usex = StringUtil_1["default"].random_int(0, 1);
                        uface = StringUtil_1["default"].random_int(1, 9);
                        return [4 /*yield*/, MySqlAuth_1["default"].insert_guest_user(unick, uface, usex, body.guestkey)];
                    case 2:
                        insert_ret = _a.sent();
                        if (insert_ret) {
                            AuthLoginInterface.do_guest_login_req(session, utag, proto_type, raw_cmd);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        sql_info = data[0];
                        resbody = {
                            status: 1,
                            uid: sql_info.uid,
                            userlogininfo: JSON.stringify(sql_info)
                        };
                        Log_1["default"].info("hcc>>login_by_guestkey: ", resbody);
                        AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, resbody);
                        return [2 /*return*/];
                    case 4:
                        AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eGuestLoginRes, utag, proto_type, { status: Response_1["default"].UNAME_OR_UPWD_ERR });
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthLoginInterface.do_login_out_req = function (session, utag, proto_type, raw_cmd) {
        if (utag != 0) {
            AuthSendMsg_1["default"].send(session, AuthProto_1.Cmd.eLoginOutRes, utag, proto_type, { status: 1 });
        }
    };
    return AuthLoginInterface;
}());
exports["default"] = AuthLoginInterface;
//# sourceMappingURL=AuthLoginInterface.js.map