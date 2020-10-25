import CommonProto from '../protocol/protofile/CommonProto';
import Log from '../../utils/Log';
import GameLinkInterface from './handler/GameLinkInterface';
import GameProcessInterface from './handler/GameProcessInterface';
import GameLogicInterface from './handler/GameLogicInterface';
import GameEmojInterface from './handler/GameEmojInterface';
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
            [CommonProto.XY_ID.PUSH_USERLOSTCONNECTION]: this.on_player_lost_connect, //common
            [GameHoodleProto.XY_ID.eLoginLogicReq]: this.on_player_login_logic_server,
            [GameHoodleProto.XY_ID.eCheckLinkGameReq]: this.on_player_check_link_game,
            [GameHoodleProto.XY_ID.eUserEmojReq]: this.on_player_use_emoj,
            [GameHoodleProto.XY_ID.eUserReadyReq]: this.on_player_ready,
            [GameHoodleProto.XY_ID.ePlayerShootReq]: this.on_player_shoot,
            [GameHoodleProto.XY_ID.ePlayerBallPosReq]: this.on_player_ball_pos,
            [GameHoodleProto.XY_ID.ePlayerIsShootedReq]: this.on_player_is_shooted,
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
    on_player_login_logic_server(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameLinkInterface.do_player_login_logic_server(session, utag, proto_type, raw_cmd);
    }

    //进游戏房间后，服务推送房间内信息
    on_player_check_link_game(session:any, utag:number, proto_type:number, raw_cmd:any){
        GameProcessInterface.do_player_check_link_game(session, utag, proto_type, raw_cmd);
    }
    //使用表情
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
}

export default GameHoodleModle;