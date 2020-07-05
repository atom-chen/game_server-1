"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var DataBaseProto = __importStar(require("./DataBaseProto"));
var AuthProto = __importStar(require("./AuthProto"));
var SystemProto = __importStar(require("./SystemProto"));
var GameHoodleProto = __importStar(require("./GameHoodleProto"));
var Stype_1 = require("./Stype");
var util = __importStar(require("util"));
var Log_1 = __importDefault(require("../../utils/Log"));
var protofilePath = "./protofile/%sMsg.js";
var ProtoCmd = /** @class */ (function () {
    function ProtoCmd() {
    }
    //命名空间
    ProtoCmd.getProtoName = function (stype) {
        if (ProtoCmd.StypeProtos[stype]) {
            return ProtoCmd.StypeProtos[stype].protoName;
        }
    };
    //字段名称
    ProtoCmd.getCmdName = function (stype, ctype) {
        if (ProtoCmd.StypeProtos[stype]) {
            return ProtoCmd.StypeProtos[stype].CmdName[ctype];
        }
    };
    //获取xxxproto.js文件对象
    ProtoCmd.getProtoFileObj = function (stype) {
        if (ProtoCmd.StypeProtos[stype]) {
            var protoName = ProtoCmd.StypeProtos[stype].protoName;
            if (protoName) {
                var pname = util.format(protofilePath, protoName);
                var proto_js_file = require(pname);
                return proto_js_file;
            }
        }
    };
    //获取protobuf字段
    ProtoCmd.getProtoMsg = function (stype, ctype) {
        var proto_file_obj = ProtoCmd.getProtoFileObj(stype);
        if (util.isNullOrUndefined(proto_file_obj)) {
            Log_1["default"].warn("getProtoMsg proto_file_obj is null");
            return;
        }
        var proto_name = ProtoCmd.getProtoName(stype);
        var cmd_name = ProtoCmd.getCmdName(stype, ctype);
        if (util.isNullOrUndefined(proto_name) || util.isNullOrUndefined(cmd_name)) {
            Log_1["default"].warn("getProtoMsg stype:", stype, " or ctype:", ctype, " is null");
            return;
        }
        var proto_namespace = proto_file_obj[proto_name];
        if (util.isNullOrUndefined(proto_namespace)) {
            Log_1["default"].warn("getProtoMsg stype:", proto_name, "is null");
            return;
        }
        var proto_msg = proto_namespace[cmd_name];
        if (util.isNullOrUndefined(proto_msg)) {
            Log_1["default"].warn("getProtoMsg cmd:", cmd_name, "is null");
            return;
        }
        return proto_msg;
    };
    //服务器下标->协议脚本
    ProtoCmd.StypeProtos = (_a = {},
        _a[Stype_1.Stype.Auth] = AuthProto,
        _a[Stype_1.Stype.GameSystem] = SystemProto,
        _a[Stype_1.Stype.GameHoodle] = GameHoodleProto,
        _a[Stype_1.Stype.DataBase] = DataBaseProto,
        _a);
    return ProtoCmd;
}());
exports["default"] = ProtoCmd;
//# sourceMappingURL=ProtoCmd.js.map