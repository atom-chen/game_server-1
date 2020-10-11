import ServiceBase from "../../netbus/ServiceBase";
import NetClient from "../../netbus/NetClient";
import Log from "../../utils/Log";
import GameRouteSaveSession from './GameRouteSaveSession';
import NetServer from "../../netbus/NetServer";
import CommonProto from '../protocol/protofile/CommonProto';
import RedisLobby from '../../database/RedisLobby';
import * as util from 'util';

class GameRouteService extends ServiceBase {
    service_name: string = "LogicRouteService"; // 服务名`称
    is_transfer: boolean = false; // 是否为转发模块,

    // 收到客户端，或者其他服务发来的数据 on_recv_client_player_cmd
    //session: gateway session
    static async on_recv_client_player_cmd(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: any) {
        if(!utag || utag == 0){
            Log.error("utag is invalid");
            return
        }

        let server_index = -1;
        let roominfo_json = await RedisLobby.get_roominfo_by_uid(utag);
        if (roominfo_json){
            try {
                let roominfo_obj = JSON.parse(roominfo_json);
                server_index = roominfo_obj.game_serverid;
            } catch (error) {
                Log.error(error);
            }
        }

        if (util.isNullOrUndefined(server_index) || server_index < 0){
            Log.warn("server_index is invalid!" , server_index);
            return;
        }

        let server_session = GameRouteSaveSession.get_logic_server_session(server_index);
        if (server_session){
            NetClient.send_encoded_cmd(server_session, raw_cmd);
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
