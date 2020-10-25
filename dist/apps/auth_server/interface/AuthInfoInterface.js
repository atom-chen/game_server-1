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
var AuthSendMsg_1 = __importDefault(require("../AuthSendMsg"));
var AuthProto_1 = __importDefault(require("../../protocol/protofile/AuthProto"));
var RedisAuth_1 = __importDefault(require("../../../database/RedisAuth"));
var AuthInfoInterface = /** @class */ (function () {
    function AuthInfoInterface() {
    }
    AuthInfoInterface.do_get_user_center_info_req = function (session, utag, proto_type, raw_cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var data, sql_info, resbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (utag == 0) {
                            AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response_1["default"].ERROR_1 });
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, MySqlAuth_1["default"].get_uinfo_by_uid(utag)];
                    case 1:
                        data = _a.sent();
                        if (!(data && data.length > 0)) return [3 /*break*/, 3];
                        sql_info = data[0];
                        resbody = {
                            status: Response_1["default"].SUCCESS,
                            usercenterinfo: JSON.stringify(sql_info)
                        };
                        AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_USERCENTERINFO, utag, proto_type, resbody);
                        return [4 /*yield*/, RedisAuth_1["default"].set_uinfo_inredis(utag, sql_info)];
                    case 2:
                        _a.sent();
                        // let outInfo = await RedisAuth.get_uinfo_inredis(utag);
                        // Log.info("hcc>>outInfo:" , outInfo);
                        return [2 /*return*/];
                    case 3:
                        AuthSendMsg_1["default"].send(session, AuthProto_1["default"].XY_ID.RES_USERCENTERINFO, utag, proto_type, { status: Response_1["default"].ERROR_2 });
                        return [2 /*return*/];
                }
            });
        });
    };
    return AuthInfoInterface;
}());
exports["default"] = AuthInfoInterface;
//# sourceMappingURL=AuthInfoInterface.js.map