import ServiceBase from "../../netbus/ServiceBase";
import NetClient from "../../netbus/NetClient";
import Log from "../../utils/Log";
import GameRouteSaveSession from './GameRouteSaveSession';
import NetServer from "../../netbus/NetServer";
import CommonProto from '../protocol/protofile/CommonProto';

class GameRouteService extends ServiceBase {
    service_name: string = "LogicRouteService"; // 服务名`称
    is_transfer: boolean = false; // 是否为转发模块,

    // 收到客户端，或者其他服务发来的数据 on_recv_client_player_cmd
    //session: gateway session
    static on_recv_client_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        //选择一个没有超负载的服务进行发送消息，并进行标记，下次发消息也发给当前标记服务
        // utag_server_ip_port_map  保存客户端utag 和服务端ip_port的映射，使得下次发消息会发送到该服务端
        // utag_server_ip_port_map = {utag: server_ip_port_key}
        if(!utag || utag == 0){
            Log.error("utag is invalid");
            return
        }

        let server_session = null;
        if (session.utag_server_ip_port_map) {
            let server_key = session.utag_server_ip_port_map[utag];
            server_session = NetClient.get_server_session(server_key);
            if (server_session) {
                NetClient.send_encoded_cmd(server_session, raw_cmd);
            } else {
                server_session = NetClient.choose_server();
                if (server_session) {
                    NetClient.send_encoded_cmd(server_session, raw_cmd);
                    session.utag_server_ip_port_map[utag] = server_session.session_key;
                    server_session.load_count++;
                    Log.info("hcc>>load111: ", server_session.load_count);
                }
            }
        } else {
            server_session = NetClient.choose_server();
            if (server_session) {
                NetClient.send_encoded_cmd(server_session, raw_cmd);
                server_session.load_count++;
                Log.info("hcc>>load222: ", server_session.load_count);
                let utag_ip_port_map:any = {};
                utag_ip_port_map[utag] = server_session.session_key;
                session.utag_server_ip_port_map = utag_ip_port_map;
            }
        }

        //有玩家掉线就删掉对应
        if(ctype == CommonProto.XY_ID.PUSH_USERLOSTCONNECTION){
            if (session.utag_server_ip_port_map){
                session.utag_server_ip_port_map[utag] = null;
                delete session.utag_server_ip_port_map[utag];
            }
            if(server_session){
                server_session.load_count--;
                Log.info("hcc>>load333: ", server_session.load_count);
            }
        }
    }

    // 收到连接的其他服务发过来的消息,这里发给gateway,从而转发到客户端
    // session : connected to other server`s session
    static on_recv_server_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        let gateway_session = GameRouteSaveSession.get_gateway_session();
        if (gateway_session) {
            NetServer.send_encoded_cmd(gateway_session, raw_cmd); //发给网关
        }
    }

    // 收到客户端断开连接(和当前服务直接连接的客户端，当前作为服务端)
    // session: gateway session
    // 这里表示gateway 断开连接了
    static on_player_disconnect(session: any, stype: number) {
    }
}

export default GameRouteService;
