//网关服务

import NetBus from '../../netbus/NetBus';
import ProtoTools from "../../netbus/ProtoTools"
import ProtoCmd from "../protocol/ProtoCmd"
import ProtoManager from "../../netbus/ProtoManager"
import Respones from "../protocol/Response"
import ServiceBase from "../../netbus/ServiceBase"
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd } from '../protocol/AuthProto';
import CommonProto from '../protocol/CommonProto';
import Log from '../../utils/Log';
import GatewayFunction from './GatewayFunction';
import * as util from 'util';
import NetClient from '../../netbus/NetClient';

class GatewayService extends ServiceBase {
	service_name: string = "GatewayService"; // 服务名称
	is_transfer: boolean = true; 			// 是否为转发模块,
	
	//客户端发到网关，网关转发到服务器
	//session 客户端session
	static on_recv_client_player_cmd(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any){
		let server_session = GatewayFunction.get_server_session(stype);
		if (util.isNullOrUndefined(server_session)) {
			return;
		}
		// 打入能够标识client的utag, uid, session.session_key,
		if (GatewayFunction.is_login_req_cmd(stype, ctype)) { //还没登录
			if (utag == 0) {//普通玩家，还没登录
				utag = session.session_key;	
			} else {//机器人,本来就有utag
				session.is_robot = true;
				session.session_key = utag;
				NetBus.save_global_session(session, session.session_key);
			}
		}else { //登录后
			if(session.uid == 0) {
				return;
			}
			if(session.is_robot == false){
				utag = session.uid;
			}
		}
		ProtoTools.write_utag_inbuf(raw_cmd, utag);
		NetClient.send_encoded_cmd(server_session,raw_cmd);
		Log.info("recv_client>>> ", ProtoCmd.getProtoName(stype) + ",", ProtoCmd.getCmdName(stype, ctype), ",utag:", utag);
	}
	
	//服务器发到网关，网关转发到客户端
	//session,其他服务的session
	static on_recv_server_player_cmd (session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:any) {
		Log.info("recv_server>>> ", ProtoCmd.getProtoName(stype) + ",", ProtoCmd.getCmdName(stype, ctype) + " ,utag:", utag);
		let client_session = null;
		if (GatewayFunction.is_login_res_cmd(stype, ctype)) { // 还没登录,utag == session.session_key
			client_session = NetBus.get_client_session(utag);
			if (util.isNullOrUndefined(client_session)) {
				return;
			}
			let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
			if (body.status == Respones.OK) {
				// 以前你登陆过,发送一个命令给这个客户端，告诉它说以前有人登陆
				let prev_session = GatewayFunction.get_session_by_uid(body.uid);
				if (prev_session) {
					NetBus.send_cmd(prev_session, stype, Cmd.eReloginRes, utag, proto_type);
					prev_session.uid = 0;
					NetBus.session_close(prev_session);
				}

				if(body.uid){
					client_session.uid = body.uid;
					GatewayFunction.save_session_with_uid(body.uid, client_session, proto_type);
					body.uid = 0;
					raw_cmd = ProtoManager.encode_cmd(stype, ctype, utag, proto_type, body);
				}
			} 
		}else{ //已经登录,utag == uid
			client_session = GatewayFunction.get_session_by_uid(utag);
		}

		if (client_session){
			NetBus.send_encoded_cmd(client_session,raw_cmd);
			if(ctype == Cmd.eLoginOutRes && stype == Stype.Auth){
				GatewayFunction.clear_session_with_uid(utag);
			}
		}
	}

	//玩家掉线,网关发消息给其他服务，其他服务接收eUserLostConnectRes协议进行处理就好了
	//session: 客户端session
	static on_player_disconnect(session:any, stype:number) {
		if (stype == Stype.Auth) { // 由Auth服务保存的，那么就由Auth清空
			GatewayFunction.clear_session_with_uid(session.uid);
		}

		let server_session = GatewayFunction.get_server_session(stype);
		if (util.isNullOrUndefined(server_session)) {
			return;
		}

		if(session.uid == 0){
			return;
		}
		//客户端被迫掉线
		let body = {is_robot : session.is_robot};
		NetBus.send_cmd(server_session, stype, CommonProto.eUserLostConnectRes, session.uid, ProtoTools.ProtoType.PROTO_JSON, body);
		//机器人服务掉线，机器人的sessioin全部删除
		if(session.is_robot){
			let del_session_key = [];
			let global_session_list = NetBus.get_global_session_list();
			for (let session_key in global_session_list){
				if (global_session_list[session_key].is_robot){
					del_session_key.push(session_key);
				}
			}
			if(del_session_key.length > 0){
				del_session_key.forEach(key => {
					NetBus.delete_global_session(key);
				})
			}
		}
	}
}

export default GatewayService;
