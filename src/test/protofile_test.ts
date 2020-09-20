import ProtoCmd from '../apps/protocol/ProtoCmd';
import Log from '../utils/Log';
import LobbyProto from '../apps/protocol/protofile/LobbyProto';
import * as util from 'util';
import AuthProto from '../apps/protocol/protofile/AuthProto';
import Stype from '../apps/protocol/Stype';

let stype = Stype.S_TYPE.Auth;
let ctype = AuthProto.XY_ID.RES_UNAMEREGIST; //eUnameLoginReq

let msgType = ProtoCmd.getProtoMsg(stype,ctype)

let body = {
    status : 999,
}

let error = msgType.verify(body)
if (error) {
    Log.error(error)
}

let message = msgType.create(body);
let emcode_msg = msgType.encode(message).finish();

let decodemsg = msgType.decode(emcode_msg);

Log.info(decodemsg);


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