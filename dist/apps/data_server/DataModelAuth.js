"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Response_1 = __importDefault(require("../protocol/Response"));
var ProtoManager_1 = __importDefault(require("../../netbus/ProtoManager"));
var CommonProto_1 = __importDefault(require("../protocol/CommonProto"));
var Log_1 = __importDefault(require("../../utils/Log"));
var Stype_1 = require("../protocol/Stype");
var DataBaseProto_1 = require("../protocol/DataBaseProto");
var DataSend_1 = __importDefault(require("./DataSend"));
var DataModelAuth = /** @class */ (function () {
    function DataModelAuth() {
        var _a;
        this._cmd_handler_map = {};
        this._cmd_handler_map = (_a = {},
            _a[CommonProto_1["default"].eUserLostConnectRes] = this.on_player_lost_connect,
            _a[DataBaseProto_1.Cmd.eAuthUinfoReq] = this.on_player_get_auth_info,
            _a);
    }
    DataModelAuth.getInstance = function () {
        return DataModelAuth.Instance;
    };
    DataModelAuth.prototype.decode_cmd = function (proto_type, raw_cmd) {
        return ProtoManager_1["default"].decode_cmd(proto_type, raw_cmd);
    };
    DataModelAuth.prototype.recv_cmd_msg = function (session, stype, ctype, utag, proto_type, raw_cmd) {
        var ctypeName = ctype == CommonProto_1["default"].eUserLostConnectRes ? "UserLostConnectRes" : DataBaseProto_1.CmdName[ctype];
        Log_1["default"].info("recv_cmd_msg: stype:", Stype_1.StypeName[stype], " ,cmdName: ", ctypeName, " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    };
    DataModelAuth.prototype.on_player_lost_connect = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("on_player_lost_connect utag:", utag, body);
    };
    DataModelAuth.prototype.on_player_get_auth_info = function (session, utag, proto_type, raw_cmd) {
        var body = this.decode_cmd(proto_type, raw_cmd);
        Log_1["default"].info("on_player_get_auth_info utag:", utag, body);
        var res_body = {
            status: Response_1["default"].OK,
            result: "success!!"
        };
        DataSend_1["default"].send_cmd(session, DataBaseProto_1.Cmd.eAuthUinfoRes, utag, res_body);
    };
    DataModelAuth.Instance = new DataModelAuth();
    return DataModelAuth;
}());
exports["default"] = DataModelAuth;
//# sourceMappingURL=DataModelAuth.js.map