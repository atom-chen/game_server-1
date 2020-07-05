import ProtoManager from "./ProtoManager";
import { Stype , StypeName } from '../apps/protocol/Stype';
import Log from '../utils/Log';
import * as util from 'util';

class ServiceManager {
    static service_modules:any = {};    

    static register_service(stype:number, service:any) {
        if (ServiceManager.service_modules[stype]) {
            Log.warn(StypeName[stype] , " service is registed !!!!");
        }
    
        ServiceManager.service_modules[stype] = service;
    }
    
    static on_recv_server_cmd(session:any, cmd_buf:Buffer) {
        if (session.is_encrypt) {
            cmd_buf = ProtoManager.decrypt_cmd(cmd_buf);	
        }
        var cmd = ProtoManager.decode_cmd_header(cmd_buf);
        if (!cmd) {
            return false;
        }
        var stype 		= cmd[0]; 
        var ctype 		= cmd[1];
        var utag 		= cmd[2];
        var proto_type 	= cmd[3];
    
        if (!ServiceManager.service_modules[stype]) {
            Log.error("cur as client ServiceManager.service_modules not exist")
            return false;
        }
        
        if (util.isNullOrUndefined(stype) || util.isNullOrUndefined(ctype) || util.isNullOrUndefined(utag) || util.isNullOrUndefined(proto_type)) {
            Log.error("cmd error")
            return false;
        }
        if (ServiceManager.service_modules[stype].on_recv_server_player_cmd){
            ServiceManager.service_modules[stype].on_recv_server_player_cmd(session, stype, ctype, utag, proto_type, cmd_buf);
        }
        return true;
    }
    
    static on_recv_client_cmd(session:any, cmd_buf:Buffer) {
        // 根据收到的数据解码命令
        if (!cmd_buf){
            return false;
        }
        if (session.is_encrypt) {
            cmd_buf = ProtoManager.decrypt_cmd(cmd_buf);	
        }
        var cmd = ProtoManager.decode_cmd_header(cmd_buf);
        if (!cmd) {
            return false;
        }
        var stype 		= cmd[0];
        var ctype 		= cmd[1];
        var utag 		= cmd[2];
        var proto_type 	= cmd[3];
    
        if (!ServiceManager.service_modules[stype]) {
            Log.error("cur as server ServiceManager.service_modules not exist")
            return false;
        }
    
        if (util.isNullOrUndefined(stype) || util.isNullOrUndefined(ctype) || util.isNullOrUndefined(utag) || util.isNullOrUndefined(proto_type)) {
            Log.error("cmd error")
            return false;
        }
        
        if (ServiceManager.service_modules[stype].on_recv_client_player_cmd){
            ServiceManager.service_modules[stype].on_recv_client_player_cmd(session, stype, ctype, utag, proto_type, cmd_buf);
        }
        return true;
    }
    
    // 玩家掉线
    static on_client_lost_connect(session:any) {
        // 遍历所有的服务模块通知在这个服务上的这个玩家掉线了
        for(var stype in ServiceManager.service_modules) {
            if (ServiceManager.service_modules[stype].on_player_disconnect){
                ServiceManager.service_modules[stype].on_player_disconnect(session,stype);
            }
        }
    }
}

export default ServiceManager;