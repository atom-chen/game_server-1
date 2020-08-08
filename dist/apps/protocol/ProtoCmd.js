"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _a;
exports.__esModule = true;
var AuthProto = __importStar(require("./protofile/AuthProto"));
var SystemProto = __importStar(require("./SystemProto"));
var GameHoodleProto = __importStar(require("./protofile/GameHoodleProto"));
var Stype_1 = require("./Stype");
var protoFilePath = "./protofileMsg/";
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
            var protoNameMsg = ProtoCmd.StypeProtos[stype].protoNameMsg;
            if (protoNameMsg) {
                var proto_js_file = require(protoFilePath + protoNameMsg);
                if (!proto_js_file) {
                    proto_js_file = require(protoNameMsg);
                }
                return proto_js_file;
            }
        }
    };
    //获取protobuf字段
    ProtoCmd.getProtoMsg = function (stype, ctype) {
        var proto_file_obj = ProtoCmd.getProtoFileObj(stype);
        if (!proto_file_obj) {
            console.warn("getProtoMsg proto_file_obj is null");
            return;
        }
        var proto_name = ProtoCmd.getProtoName(stype);
        var cmd_name = ProtoCmd.getCmdName(stype, ctype);
        if (!proto_name || !cmd_name) {
            console.warn("getProtoMsg stype:", stype, " or ctype:", ctype, " is null");
            return;
        }
        var proto_namespace = proto_file_obj[proto_name];
        if (!proto_namespace) {
            console.warn("getProtoMsg stype:", proto_name, "is null");
            return;
        }
        var proto_msg = proto_namespace[cmd_name];
        if (!proto_msg) {
            console.warn("getProtoMsg cmd:", cmd_name, "is null");
            return;
        }
        return proto_msg;
    };
    //服务器下标->协议脚本
    ProtoCmd.StypeProtos = (_a = {},
        _a[Stype_1.Stype.Auth] = AuthProto,
        _a[Stype_1.Stype.GameSystem] = SystemProto,
        _a[Stype_1.Stype.GameHoodle] = GameHoodleProto,
        _a);
    return ProtoCmd;
}());
exports["default"] = ProtoCmd;
//# sourceMappingURL=ProtoCmd.js.map