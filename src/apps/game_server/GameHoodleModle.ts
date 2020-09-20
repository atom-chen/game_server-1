import GameSendMsg from './GameSendMsg';
import CommonProto from '../protocol/protofile/CommonProto';
import Response from '../protocol/Response';
import Log from '../../utils/Log';
import GameInfoInterface from './interface/GameInfoInterface';
import GameLinkInterface from './interface/GameLinkInterface';
import GameRoomInterface from './interface/GameRoomInterface';
import GameMatchInterface from './interface/GameMatchInterface';
import GameProcessInterface from './interface/GameProcessInterface';
import GameLogicInterface from './interface/GameLogicInterface';
import GameCheck from './interface/GameCheck';
import GameEmojInterface from './interface/GameEmojInterface';
import GamePlayAgainInterface from './interface/GamePlayAgainInterface';
import GameConfigInterface from './interface/GameConfigInterface';
import Player from './cell/Player';
import PlayerManager from './manager/PlayerManager';
import NetClient from '../../netbus/NetClient';
import Stype from '../protocol/Stype';
import GameHoodleProto from '../protocol/protofile/GameHoodleProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class GameHoodleModle {
    private static readonly Instance: GameHoodleModle = new GameHoodleModle();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor(){
        this._cmd_handler_map = {
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]:      this.on_player_lost_connect, //hall
            [GameHoodleProto.XY_ID.eLoginLogicReq]:                   this.on_player_login_logic_server, //hall
            [GameHoodleProto.XY_ID.eCreateRoomReq]:                   this.on_player_create_room, //hall
            [GameHoodleProto.XY_ID.eJoinRoomReq]:                     this.on_player_join_room, //hall
            [GameHoodleProto.XY_ID.eExitRoomReq]:                     this.on_player_exit_room, //hall
            [GameHoodleProto.XY_ID.eDessolveReq]:                     this.on_player_dessolve_room, //hall
            [GameHoodleProto.XY_ID.eGetRoomStatusReq]:                this.on_player_get_room_status, //hall
            [GameHoodleProto.XY_ID.eBackRoomReq]:                     this.on_player_back_room, //hall
            [GameHoodleProto.XY_ID.eCheckLinkGameReq]:                this.on_player_check_link_game, //game
            [GameHoodleProto.XY_ID.eUserReadyReq]:                    this.on_player_ready, //game
            [GameHoodleProto.XY_ID.ePlayerShootReq]:                  this.on_player_shoot, //game
            [GameHoodleProto.XY_ID.ePlayerBallPosReq]:                this.on_player_ball_pos, //game
            [GameHoodleProto.XY_ID.ePlayerIsShootedReq]:              this.on_player_is_shooted, //game
            [GameHoodleProto.XY_ID.eUserMatchReq]:                    this.on_player_match, //game match
            [GameHoodleProto.XY_ID.eUserStopMatchReq]:                this.on_player_stop_match, //game match
            [GameHoodleProto.XY_ID.eUserGameInfoReq]:                 this.on_player_get_ugame_info, // hall
            [GameHoodleProto.XY_ID.eUserBallInfoReq]:                 this.on_player_get_ball_info, //hall
            [GameHoodleProto.XY_ID.eUpdateUserBallReq]:               this.on_player_update_ball_info, //hall
            [GameHoodleProto.XY_ID.eStoreListReq]:                    this.on_player_store_list, //hall
            [GameHoodleProto.XY_ID.eBuyThingsReq]:                    this.on_player_buy_things, //hall
            [GameHoodleProto.XY_ID.eUserConfigReq]:                   this.on_player_get_config, //hall
            [GameHoodleProto.XY_ID.eUseHoodleBallReq]:                this.on_player_use_hoodleball, //hall
            [GameHoodleProto.XY_ID.eUserEmojReq]:                     this.on_player_use_emoj, //game
            [GameHoodleProto.XY_ID.eUserPlayAgainReq]:                this.on_player_play_again_req, //game
            [GameHoodleProto.XY_ID.eUserPlayAgainAnswerReq]:          this.on_player_play_again_answer, //game
            [GameHoodleProto.XY_ID.eRoomListConfigReq]:               this.on_player_room_list_req,//hall
        }
    }

    public static getInstance(){
        return GameHoodleModle.Instance;
    }

    public recv_cmd_msg(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:Buffer){
        let player:Player = PlayerManager.getInstance().get_player(utag);
        let unick = "none";
        if(player){
            unick = player.get_unick();
        }
        let cmdname = "";
        if (ctype == 10000){
            cmdname = "lostconnect"
        }else{
            cmdname = Stype.S_NAME[ctype];
        }

        Log.info("recv_cmd_msg: ", Stype.S_NAME[stype], cmdname, utag, unick);
        if (this._cmd_handler_map[ctype]){
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
        
        //同时发一遍给room 服务
        //选择一个没有超负载的服务进行发送消息，并进行标记，下次发消息也发给当前标记服务
        //client_server_ip_port_map  保存客户端ip_port 和服务端ip_port的映射，使得下次发消息会发送到该服务端
        // client_server_ip_port_map = {client_ip_port_key: server_ip_port_key}
        /*
        let client_ip = session.remoteAddress || "";
        let client_port = session.remotePort || "";
        let client_key = client_ip + ":" + client_port;
        let client_server_ip_port_map: any = session.client_server_ip_port_map; //map: client_ip_port_key: server_ip_port__key
        if (client_server_ip_port_map) {
            let server_key = client_server_ip_port_map[client_key];
            let server_session = NetClient.get_server_session(server_key);
            if (server_session){
                NetClient.send_encoded_cmd(server_session, raw_cmd);
            }else{
                server_session = NetClient.choose_server();
                if (server_session) {
                    NetClient.send_encoded_cmd(server_session, raw_cmd);
                    client_server_ip_port_map[client_key] = server_session.server_ip_port_key;
                    session.client_server_ip_port_map = client_server_ip_port_map;
                }                    
            }
        } else {
            let server_session = NetClient.choose_server();
            if (server_session) {
                NetClient.send_encoded_cmd(server_session, raw_cmd);
                client_server_ip_port_map = {};
                client_server_ip_port_map[client_key] = server_session.server_ip_port_key;
                session.client_server_ip_port_map = client_server_ip_port_map;
            }
        }
        */
    }

    //玩家离开逻辑服务
    on_player_lost_connect(session:any, utag:number, proto_type:number, raw_cmd:any){
        if(!GameCheck.check_player(utag)){
            return;
        }
        GameLinkInterface.do_player_lost_connect(utag, proto_type, raw_cmd);
    }
    //登录逻辑服务
    private on_player_login_logic_server(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLinkInterface.do_player_login_logic_server(session, utag, proto_type, raw_cmd);
    }

    //创建房间
    private on_player_create_room(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("create_room player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eCreateRoomRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameRoomInterface.do_player_create_room(utag, proto_type, raw_cmd);
    }
    //加入房间
    private on_player_join_room(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("join_room error, player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eJoinRoomRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameRoomInterface.do_player_join_room(utag, proto_type, raw_cmd);
    }
    //离开房间
    private on_player_exit_room(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("exit_room player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eExitRoomRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameRoomInterface.do_player_exit_room(utag);
    }
    //解散房间
    private on_player_dessolve_room(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("dessolve_room error, player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eDessolveRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameRoomInterface.do_player_dessolve_room(utag);
    }
    //获取是否创建过房间
    private on_player_get_room_status(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("get_room_status player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eGetRoomStatusRes, utag, proto_type, {status: Response.SYSTEM_ERR})
            return;
        }
       GameRoomInterface.do_player_get_room_status(utag);
    }

    //返回房间
    private on_player_back_room(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("back_room player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eBackRoomRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameRoomInterface.do_player_back_room(utag);
    }

    //进游戏房间后，服务推送房间内信息
    on_player_check_link_game(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("check_link_game player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eCheckLinkGameRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameProcessInterface.do_player_check_link_game(utag);
    }

    //玩家准备
    on_player_ready(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("on_user_ready player is not exist!")
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserReadyRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            return;
        }
        GameProcessInterface.do_player_ready(utag);
    }
    
    //玩家射击
    on_player_shoot(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("on_player_shoot player is not exist!")
            return;
        }
        GameLogicInterface.do_player_shoot(utag, proto_type, raw_cmd);
    }

    //玩家位置信息
    on_player_ball_pos(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("on_player_ball_pos player is not exist!")
            return;
        }
        GameLogicInterface.do_player_ball_pos(utag, proto_type, raw_cmd);
    }

    //玩家被射中
    on_player_is_shooted(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            Log.warn("on_player_is_shooted player is not exist!")
            return;
        }
        GameLogicInterface.do_player_is_shooted(utag, proto_type, raw_cmd);
    }

    on_player_match(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserMatchRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_match player is not exist!")
            return;
        }
        GameMatchInterface.do_player_match(utag, proto_type, raw_cmd);
    }

    on_player_stop_match(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserStopMatchRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_stop_match error player is not exist!")
            return;
        }
        GameMatchInterface.do_player_stop_match(utag);
    }

    //游戏服信息,没有去创建，有就返回原来数据
    on_player_get_ugame_info(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserGameInfoRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_user_match player is not exist!")
            return;
        }
        GameInfoInterface.do_player_get_ugame_info(utag);
    }

    //获取小球信息
    on_player_get_ball_info(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserBallInfoRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_get_ball_info error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_get_ball_info(utag);
    }

    //更新小球信息,合成，卖掉，赠送等
    on_player_update_ball_info(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUpdateUserBallRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_update_ball_info error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_update_ball_info(utag, proto_type, raw_cmd);
    }
    
    //请求商城列表
    on_player_store_list(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eStoreListRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_store_list error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_store_list(utag);
    }
    
    on_player_buy_things(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUpdateUserBallRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_buy_things error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_buy_things(utag, proto_type, raw_cmd);
    }

    on_player_use_hoodleball(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUseHoodleBallRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_use_hoodlebal error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_use_hoodleball(utag, proto_type, raw_cmd);
    }

    on_player_get_config(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserConfigRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_config error player is not exist!")
            return;
        }
        GameInfoInterface.do_player_get_user_config(utag);
    }

    on_player_use_emoj(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserEmojRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_use_emoj error player is not exist!")
            return;
        }
        GameEmojInterface.do_player_use_emoj(utag, proto_type, raw_cmd);
    }

    on_player_play_again_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserPlayAgainRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_play_again_req error player is not exist!")
            return;
        }
        GamePlayAgainInterface.do_player_play_again_req(utag, proto_type, raw_cmd);
    }

    on_player_play_again_answer(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserPlayAgainAnswerRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_play_again_answer error player is not exist!")
            return;
        }
        GamePlayAgainInterface.do_player_play_again_answer(utag, proto_type, raw_cmd);
    }

    on_player_room_list_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eRoomListConfigRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_room_list_req error player is not exist!")
            return;
        }
        GameConfigInterface.do_player_room_list_req(utag, proto_type, raw_cmd);
    }
}

export default GameHoodleModle;