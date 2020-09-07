//游戏逻辑服务

import ServiceBase from '../../../netbus/ServiceBase';
import GameHoodleModle from './GameHoodleModle';
import Log from '../../../utils/Log';
import NetServer from '../../../netbus/NetServer';

let gateway_session:any = null;

class GameHoodleService extends ServiceBase {
	 service_name:string = "GameHoodleService"; // 服务名称
	 is_transfer:boolean = false; // 是否为转发模块,
	
	 // 收到客户端，或者其他服务发来的数据
	static on_recv_client_player_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any){
		gateway_session = session; //保存一下网关session
		GameHoodleModle.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
	}
	
	// 收到连接的其他服务发过来的消息
	static on_recv_server_player_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any) {
		Log.info("hcc>>on_recv_server_player_cmd: " , stype, ctype, utag, proto_type)
		if(gateway_session){
			NetServer.send_encoded_cmd(gateway_session, raw_cmd); //发给网关
		}
	} 
	
	// 收到客户端断开连接(和当前服务直接连接的客户端，当前作为服务端)
	static on_player_disconnect(session: any, stype: number) {
		Log.info("client lost connect.......... stype:", stype);
	}
}

export default GameHoodleService;
