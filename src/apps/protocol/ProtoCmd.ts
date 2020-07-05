import * as DataBaseProto from "./DataBaseProto"
import * as AuthProto from "./AuthProto"
import * as SystemProto from "./SystemProto"
import * as GameHoodleProto from "./GameHoodleProto"
import { Stype, StypeName } from './Stype';
import * as util from 'util';
import Log from '../../utils/Log';

let protofilePath = "./protofile/%sMsg.js"

class ProtoCmd {
	
	//服务器下标->协议脚本
	  static StypeProtos:any = {
		  [Stype.Auth]: AuthProto,
		  [Stype.GameSystem]: SystemProto,
		  [Stype.GameHoodle] : GameHoodleProto,
		  [Stype.DataBase]: DataBaseProto,
	}
	
	//命名空间
	static getProtoName(stype: number){
		if(ProtoCmd.StypeProtos[stype]){
			return ProtoCmd.StypeProtos[stype].protoName
		}
	}
	
	//字段名称
	static getCmdName(stype:number, ctype:number){
		if(ProtoCmd.StypeProtos[stype]){
			return ProtoCmd.StypeProtos[stype].CmdName[ctype]
		}
	}

	//获取xxxproto.js文件对象
	static getProtoFileObj(stype:number){
		if (ProtoCmd.StypeProtos[stype]) {
			let protoName = ProtoCmd.StypeProtos[stype].protoName;
			if (protoName){
				let pname = util.format(protofilePath,protoName);
				let proto_js_file = require(pname);
				return proto_js_file;
			}
		}
	}

	//获取protobuf字段
	static getProtoMsg(stype:number, ctype:number){
		let proto_file_obj = ProtoCmd.getProtoFileObj(stype);
		if (util.isNullOrUndefined(proto_file_obj)){
			Log.warn("getProtoMsg proto_file_obj is null");
			return;
		}

		let proto_name = ProtoCmd.getProtoName(stype);
		let cmd_name = ProtoCmd.getCmdName(stype, ctype);

		if (util.isNullOrUndefined(proto_name) || util.isNullOrUndefined(cmd_name)){
			Log.warn("getProtoMsg stype:", stype , " or ctype:" , ctype , " is null");
			return;
		}

		let proto_namespace = proto_file_obj[proto_name];
		if(util.isNullOrUndefined(proto_namespace)){
			Log.warn("getProtoMsg stype:", proto_name , "is null");
			return;
		}
		let proto_msg = proto_namespace[cmd_name];
		if(util.isNullOrUndefined(proto_msg)){
			Log.warn("getProtoMsg cmd:", cmd_name, "is null");
			return;
		}
		return proto_msg;
	}
}

export default ProtoCmd;

