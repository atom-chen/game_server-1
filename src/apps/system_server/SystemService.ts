//系统服务

import ServiceBase from "../../netbus/ServiceBase"
import SystemModel from './SystemModel';

class SystemService extends ServiceBase {
    service_name: string = "SystemService"; // 服务名称
    is_transfer: boolean = false; // 是否为转发模块,
    // 收到客户端，或者其他服务发来的数据
    static on_recv_client_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        SystemModel.getInstance().recv_cmd_msg(session, stype, ctype, utag, proto_type, raw_cmd);
    }
}

export default SystemService;
