var net = require("net");
import * as AuthProto from "../apps/protocol/protofile/AuthProto"
var StickPackage 	 = require("stickpackage")

import ProtoManager from "../netbus/ProtoManager"
import Platform from "../utils/Platform"
import {Stype,StypeName}  from '../apps/protocol/Stype';
import Log from '../utils/Log';

var recvMsgCenter = new StickPackage.msgCenter({bigEndian:false})

var local = "127.0.0.1"
var remote = "www.hccfun.com"
var hoststr = Platform.isWin32() ? local : remote
Log.info("host:" , hoststr)

var proto_type = 2

var sock = net.connect({
	port: 6080,
	host: local,
}, function() {
	console.log('tcp connected to server!');
});

sock.on("connect",function() {
	var msgCenter = new StickPackage.msgCenter({bigEndian:false})
	console.log("tcp connect success");
	var stype = Stype.Auth;
	var ctype = AuthProto.Cmd.eUnameLoginReq
	var utag = 0;
	var body = {
		uname: "test1111",
		upwd: "111111",
	}
	var cmd1 = ProtoManager.encode_cmd(stype, ctype, utag, proto_type, body) 
	//粘包处理工具
	 var cmd_buf = msgCenter.publish(cmd1)
 	setInterval(function(){
		sock.write(cmd_buf);
 	},1000)
});

sock.on("error", function(e:any) {
	Log.info("error", e);
});


sock.on("close", function() {
	Log.info("close");
});


sock.on("end", function() {
	Log.info("end event");
});

sock.on("data", function(data:any) {
	recvMsgCenter.putData(data)
});
//处理粘包
recvMsgCenter.onMsgRecv(function(cmd_buf:any){
	var cmd = ProtoManager.decode_cmd_header(cmd_buf);
	var body = ProtoManager.decode_cmd(proto_type, cmd_buf);
	Log.info("header: " , cmd)
	Log.info("body: " , body)

})