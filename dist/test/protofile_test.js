"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var ProtoCmd_1 = __importDefault(require("../apps/protocol/ProtoCmd"));
var Log_1 = __importDefault(require("../utils/Log"));
var AuthProto_1 = __importDefault(require("../apps/protocol/protofile/AuthProto"));
var Stype_1 = __importDefault(require("../apps/protocol/Stype"));
var stype = Stype_1["default"].S_TYPE.Auth;
var ctype = AuthProto_1["default"].XY_ID.RES_UNAMEREGIST; //eUnameLoginReq
var msgType = ProtoCmd_1["default"].getProtoMsg(stype, ctype);
var body = {
    status: 999
};
var error = msgType.verify(body);
if (error) {
    Log_1["default"].error(error);
}
var message = msgType.create(body);
var emcode_msg = msgType.encode(message).finish();
var decodemsg = msgType.decode(emcode_msg);
Log_1["default"].info(decodemsg);
/*
let LobbyProtoMsg = require("../apps/protocol/protofileMsg/LobbyProtoMsg")

Log.info("-------------------")
Log.info(LobbyProtoMsg)
// let msgType = LobbyProtoMsg["lobby"]["client"]["proto"]["reqLoginLobby"]
// let msgType = LobbyProtoMsg["lobby.client.proto"]

// let stypeName: string = "lobby.client.proto";
let stypeName: string = "lobby";
if (stypeName.indexOf(".") > 0){
    ////
}
let splitStr =  stypeName.split(".");

Log.info("hcc>>splitStr" , splitStr)
let result = LobbyProtoMsg;
splitStr.forEach(value => {
    result = result[value]
    if(util.isNullOrUndefined(result)){
        Log.info("not fond..........")
    }
})

let msgType = result["reqLoginLobby"]


let body = {isrobot : true}
let message = msgType.create(body);
let encode_msg = msgType.encode(message).finish();
let decode_msg = msgType.decode(encode_msg);

Log.info("-------------------" , decode_msg)
*/ 
//# sourceMappingURL=protofile_test.js.map