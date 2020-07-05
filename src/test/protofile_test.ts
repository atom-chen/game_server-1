import { Stype } from '../apps/protocol/Stype';
import ProtoCmd from '../apps/protocol/ProtoCmd';
import Log from '../utils/Log';

let stype = Stype.Auth;
let ctype = 1; //eUnameLoginReq

let stypeName = ProtoCmd.getProtoName(stype);
let cmdName = ProtoCmd.getCmdName(stype,ctype);

let protofile = ProtoCmd.getProtoFileObj(stype);

let msgType = protofile[stypeName][cmdName];

let body = {
    uname :"hcccccc",
    upwd: "123456"
}

let error = msgType.verify(body)
if (error) {
    Log.error(error)
}

let message = msgType.create(body);
let emcode_msg = msgType.encode(message).finish();

let decodemsg = msgType.decode(emcode_msg);

Log.info(decodemsg);

