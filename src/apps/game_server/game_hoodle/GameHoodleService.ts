//游戏逻辑服务

import ServiceBase from '../../../netbus/ServiceBase';
import GameHoodleModle from './GameHoodleModle';
import Log from '../../../utils/Log';
import RobotManager from './manager/RobotManager';
import Player from './cell/Player';
import GameLinkInterface from './interface/GameLinkInterface';

class GameHoodleService extends ServiceBase {
	 service_name:string = "GameHoodleService"; // 服务名称
	 is_transfer:boolean = false; // 是否为转发模块,
	
	 // 收到客户端，或者其他服务发来的数据
	static on_recv_client_player_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any){
		GameHoodleModle.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
	}
	
	// 收到连接的其他服务发过来的消息，这里不做处理
	static on_recv_server_player_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any) {
	} 
	
	// 收到客户端断开连接(和当前服务直接连接的客户端，当前作为服务端)
	static on_player_disconnect(session: any, stype: number) {
		Log.info("client lost connect.......... stype:", stype);
		//当前只有机器人服务，连接到了游戏服 ：清理所有机器人
		let robot_set = RobotManager.getInstance().get_robot_player_set();
		for(let key in robot_set){
			let robot:Player = robot_set[key];
			GameLinkInterface.do_player_lost_connect(robot.get_uid());
			RobotManager.getInstance().delete_robot_player(robot.get_uid());
		}
	}
}

export default GameHoodleService;
