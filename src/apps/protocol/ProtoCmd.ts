import * as RobotProto from "./RobotProto"
import * as Auth from "./AuthProto"
import * as GameSystem from "./SystemProto"
import * as GameHoodleProto from "./GameHoodleProto"
import { Stype, StypeName } from './Stype';

class ProtoCmd {
	//服务器下标->协议脚本
	  static StypeProtos:any = {
		  [Stype.Auth] : Auth,
		  [Stype.GameSystem] : GameSystem,
		  [Stype.GameHoodle] : GameHoodleProto,
		  [Stype.Robot]: RobotProto,
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
}

export default ProtoCmd;

