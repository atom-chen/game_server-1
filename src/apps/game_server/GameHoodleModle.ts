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
import Stype from '../protocol/Stype';
import GameHoodleProto from '../protocol/protofile/GameHoodleProto';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class GameHoodleModle {
    private static readonly Instance: GameHoodleModle = new GameHoodleModle();
    _cmd_handler_map: CmdHandlerMap = {};
    _redis_handler_map:any = {};

    private constructor(){
        this._cmd_handler_map = {
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]:              this.on_player_lost_connect, //common
            [GameHoodleProto.XY_ID.eLoginLogicReq]:                   this.on_player_login_logic_server, //game
            [GameHoodleProto.XY_ID.eCheckLinkGameReq]:                this.on_player_check_link_game, //game
            [GameHoodleProto.XY_ID.eUserEmojReq]:                     this.on_player_use_emoj, //game

            [GameHoodleProto.XY_ID.eUserReadyReq]:                    this.on_player_ready, //game
            [GameHoodleProto.XY_ID.ePlayerShootReq]:                  this.on_player_shoot, //game
            [GameHoodleProto.XY_ID.ePlayerBallPosReq]:                this.on_player_ball_pos, //game
            [GameHoodleProto.XY_ID.ePlayerIsShootedReq]:              this.on_player_is_shooted, //game

            // [GameHoodleProto.XY_ID.eUserGameInfoReq]:                 this.on_player_get_ugame_info, // lobby
            // [GameHoodleProto.XY_ID.eUserBallInfoReq]:                 this.on_player_get_ball_info, //lobby
            // [GameHoodleProto.XY_ID.eUpdateUserBallReq]:               this.on_player_update_ball_info, //lobby
            // [GameHoodleProto.XY_ID.eBuyThingsReq]:                    this.on_player_buy_things, //lobby
            // [GameHoodleProto.XY_ID.eUserConfigReq]:                   this.on_player_get_config, //lobby
            // [GameHoodleProto.XY_ID.eUseHoodleBallReq]:                this.on_player_use_hoodleball, //lobby
            // [GameHoodleProto.XY_ID.eRoomListConfigReq]:               this.on_player_room_list_req,//lobby

            // [GameHoodleProto.XY_ID.eUserMatchReq]:                    this.on_player_match, //game match
            // [GameHoodleProto.XY_ID.eUserStopMatchReq]:                this.on_player_stop_match, //game match
            // [GameHoodleProto.XY_ID.eStoreListReq]:                    this.on_player_store_list, //lobby
            // [GameHoodleProto.XY_ID.eUserPlayAgainReq]:                this.on_player_play_again_req, //lobby
            // [GameHoodleProto.XY_ID.eUserPlayAgainAnswerReq]:          this.on_player_play_again_answer, //lobby
        }
    }

    public static getInstance(){
        return GameHoodleModle.Instance;
    }

    public recv_cmd_msg(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:Buffer){
        let cmdname = "";
        if (ctype == CommonProto.XY_ID.PUSH_USERLOSTCONNECTION){
            cmdname = "lostconnect"
        }else{
            cmdname = GameHoodleProto.XY_NAME[ctype];
        }

        Log.info("recv_cmd_msg: ", Stype.S_NAME[stype], cmdname, utag);
        if (this._cmd_handler_map[ctype]){
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    //玩家离开逻辑服务
    on_player_lost_connect(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLinkInterface.do_player_lost_connect(session, utag, proto_type, raw_cmd);
    }
    //登录逻辑服务
    private on_player_login_logic_server(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLinkInterface.do_player_login_logic_server(session, utag, proto_type, raw_cmd);
    }

    //进游戏房间后，服务推送房间内信息
    on_player_check_link_game(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameProcessInterface.do_player_check_link_game(session, utag, proto_type, raw_cmd);
    }

    on_player_use_emoj(session: any, utag: number, proto_type: number, raw_cmd: any) {
        GameEmojInterface.do_player_use_emoj(session, utag, proto_type, raw_cmd);
    }

    //玩家准备
    on_player_ready(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameProcessInterface.do_player_ready(session, utag, proto_type, raw_cmd);
    }
    
    //玩家射击
    on_player_shoot(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLogicInterface.do_player_shoot(session, utag, proto_type, raw_cmd);
    }

    //玩家位置信息
    on_player_ball_pos(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLogicInterface.do_player_ball_pos(session, utag, proto_type, raw_cmd);
    }

    //玩家被射中
    on_player_is_shooted(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLogicInterface.do_player_is_shooted(session, utag, proto_type, raw_cmd);
    }

    /*
    on_player_match(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserMatchRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_match player is not exist!")
            return;
        }
        // GameMatchInterface.do_player_match(utag, proto_type, raw_cmd);
    }

    on_player_stop_match(session:any, utag:number, proto_type:number, raw_cmd:any){
        if (!GameCheck.check_player(utag)){
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserStopMatchRes, utag, proto_type, {status: Response.INVALIDI_OPT})
            Log.warn("on_player_stop_match error player is not exist!")
            return;
        }
        // GameMatchInterface.do_player_stop_match(utag);
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

    on_player_play_again_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserPlayAgainRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_play_again_req error player is not exist!")
            return;
        }
        // GamePlayAgainInterface.do_player_play_again_req(utag, proto_type, raw_cmd);
    }

    on_player_play_again_answer(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eUserPlayAgainAnswerRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_play_again_answer error player is not exist!")
            return;
        }
        // GamePlayAgainInterface.do_player_play_again_answer(utag, proto_type, raw_cmd);
    }

    on_player_room_list_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (!GameCheck.check_player(utag)) {
            GameSendMsg.send(session, GameHoodleProto.XY_ID.eRoomListConfigRes, utag, proto_type, { status: Response.INVALIDI_OPT })
            Log.warn("on_player_room_list_req error player is not exist!")
            return;
        }
        GameConfigInterface.do_player_room_list_req(utag, proto_type, raw_cmd);
    }
    */
}

export default GameHoodleModle;