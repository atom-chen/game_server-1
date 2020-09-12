import { Cmd, CmdName } from '../../protocol/protofile/GameHoodleProto';
import ProtoManager from '../../../netbus/ProtoManager';
import Log from '../../../utils/Log';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

class RoomModle {
    private static readonly Instance: RoomModle = new RoomModle();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [Cmd.eCheckLinkGameReq]: this.on_player_check_link_game, //game
            // [Cmd.eUserReadyReq]: this.on_player_ready, //game
            // [Cmd.ePlayerShootReq]: this.on_player_shoot, //game
            // [Cmd.ePlayerBallPosReq]: this.on_player_ball_pos, //game
            // [Cmd.ePlayerIsShootedReq]: this.on_player_is_shooted, //game
            // [Cmd.eUserMatchReq]: this.on_player_match, //game match
            // [Cmd.eUserStopMatchReq]: this.on_player_stop_match, //game match
            // [Cmd.eUserEmojReq]: this.on_player_use_emoj, //game
            // [Cmd.eUserPlayAgainReq]: this.on_player_play_again_req, //game
            // [Cmd.eUserPlayAgainAnswerReq]: this.on_player_play_again_answer, //game
        }
    }

    public static getInstance() {
        return RoomModle.Instance;
    }

    private decode_cmd(proto_type: number, raw_cmd: any) {
        return ProtoManager.decode_cmd(proto_type, raw_cmd);
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        let body = this.decode_cmd(proto_type, raw_cmd);
        Log.info("hcc>>recv_cmd_msg: " , stype, ctype, utag, proto_type, body);
        //NetServer.send_encoded_cmd(session,raw_cmd);
        // let player: Player = PlayerManager.getInstance().get_player(utag);
        // let unick = "none";
        // if (player) {
        //     unick = player.get_unick();
        // }
        // let cmdname = "";
        // if (ctype == 10000) {
        //     cmdname = "lostconnect"
        // } else {
        //     cmdname = CmdName[ctype];
        // }

        // Log.info("recv_cmd_msg: ", StypeName[stype], cmdname, utag, unick);
        // if (this._cmd_handler_map[ctype]) {
        //     this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        // }
    }

    //玩家离开逻辑服务
    on_player_lost_connect(session: any, utag: number, proto_type: number, raw_cmd: any) {
    }
    
    //进游戏房间后，服务推送房间内信息
    on_player_check_link_game(session: any, utag: number, proto_type: number, raw_cmd: any) {
        // if (!GameCheck.check_player(utag)) {
        //     Log.warn("check_link_game player is not exist!")
        //     GameSendMsg.send(session, Cmd.eCheckLinkGameRes, utag, proto_type, { status: Response.INVALIDI_OPT })
        //     return;
        // }
        // GameProcessInterface.do_player_check_link_game(utag);
    }

}

export default RoomModle;