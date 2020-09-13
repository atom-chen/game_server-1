"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
exports.__esModule = true;
var LobbyProto_1 = __importDefault(require("./protofile/LobbyProto"));
var AuthProto_1 = __importDefault(require("./protofile/AuthProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = __importDefault(require("./Stype"));
var protoFilePath = "./protofileMsg/";
var ProtoCmd = /** @class */ (function () {
    function ProtoCmd() {
    }
    //命名空间
    ProtoCmd.getProtoName = function (stype) {
        if (ProtoCmd.StypeProtos[stype]) {
            return ProtoCmd.StypeProtos[stype].protoNameSpace;
        }
    };
    //字段名称
    ProtoCmd.getCmdName = function (stype, ctype) {
        if (ProtoCmd.StypeProtos[stype]) {
            return ProtoCmd.StypeProtos[stype].XY_NAME[ctype];
        }
    };
    //获取xxxproto.js文件对象
    ProtoCmd.getProtoFileObj = function (stype) {
        if (ProtoCmd.StypeProtos[stype]) {
            var protoFileName = ProtoCmd.StypeProtos[stype].protoFileName;
            if (protoFileName) {
                try {
                    var proto_js_file = require(protoFilePath + protoFileName); //creator 客户端不用带路径，node.js需要带路径
                    return proto_js_file;
                }
                catch (error) {
                    Log_1["default"].error("error");
                }
            }
        }
    };
    //获取protobuf字段
    ProtoCmd.getProtoMsg = function (stype, ctype) {
        var proto_file_obj = ProtoCmd.getProtoFileObj(stype);
        if (!proto_file_obj) {
            console.warn("getProtoMsg proto_file_obj is null,111");
            return;
        }
        var proto_namespace = ProtoCmd.getProtoName(stype);
        var cmd_name = ProtoCmd.getCmdName(stype, ctype);
        if (!proto_namespace || !cmd_name) {
            console.warn("getProtoMsg stype:", stype, " or ctype:", ctype, " is null,222");
            return;
        }
        var result_obj = proto_file_obj;
        if (proto_namespace.indexOf(".") > 0) {
            var splitStr = proto_namespace.split(".");
            splitStr.forEach(function (value) {
                result_obj = result_obj[value];
                if (!result_obj) {
                    Log_1["default"].warn("getProtoMsg: ", value, "is null,333");
                    return;
                }
            });
        }
        else {
            result_obj = result_obj[proto_namespace];
        }
        if (!result_obj) {
            console.warn("getProtoMsg cmd:", proto_namespace, "is null,444");
            return;
        }
        var proto_msg = result_obj[cmd_name];
        if (!proto_msg) {
            console.warn("getProtoMsg cmd:", cmd_name, "is null,555");
            return;
        }
        return proto_msg;
    };
    //服务器下标->协议脚本
    ProtoCmd.StypeProtos = (_a = {},
        _a[Stype_1["default"].S_TYPE.Auth] = AuthProto_1["default"],
        //   [Stype.GameSystem]: SystemProto,
        //   [Stype.GameHoodle] : GameHoodleProto,
        _a[Stype_1["default"].S_TYPE.Lobby] = LobbyProto_1["default"],
        _a);
    return ProtoCmd;
}());
exports["default"] = ProtoCmd;
//# sourceMappingURL=ProtoCmd.js.map