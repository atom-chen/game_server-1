//机器人服务

import ServiceBase from "../../netbus/ServiceBase"
import RobotGameModel from "./RobotGameModel";
import { Stype } from '../protocol/Stype';
import RobotAuthModel from './RobotAuthModel';

class RobotService extends ServiceBase {
    service_name: string = "RobotService";
    is_transfer: boolean = false;

    //收到客户端发来的(当前作为服务端)
    static on_recv_client_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        
    }

    //收到连接的服务发过来的数据（当前作为客户端）
    //session: 所连接的服务的session
    static on_recv_server_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        if(stype == Stype.Auth){
            RobotAuthModel.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
        }else if(stype == Stype.GameHoodle){
            RobotGameModel.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
        }
    }

    // 收到客户端断开连接
    static on_player_disconnect(session: any, stype: number): void {

    }
}

export default RobotService;
