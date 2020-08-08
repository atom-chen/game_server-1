import Response from '../protocol/Response';
import ProtoManager from '../../netbus/ProtoManager';
import Log from '../../utils/Log';
import { Stype, StypeName } from '../protocol/Stype';
import { Cmd, CmdName } from '../protocol/GameHoodleProto';
import RobotSend from './RobotSend';
import RobotMgr from './manager/RobotMgr';
import Robot from './cell/Robot';
import * as util from 'util';
import { PlayerPower } from '../game_server/game_hoodle/config/State';
import RobotListConfig from './config/RobotListConfig';
import RobotGameInterface from './interface/RobotGameInterface';

interface CmdHandlerMap {
    [cmdtype: number]: Function;
}

/**
 * 当前作为客户端，utag用来标记哪一位玩家
 * send_game，是当前作为客户端发给game服务。
 */

class RobotGameModel {
    private static readonly Instance: RobotGameModel = new RobotGameModel();
    _cmd_handler_map: CmdHandlerMap = {};

    private constructor() {
        this._cmd_handler_map = {
            [Cmd.eLoginLogicRes]: this.on_player_login_logic_res,
            [Cmd.eGetRoomStatusRes]: this.on_player_status_res,
            [Cmd.eUserMatchRes]: this.on_event_match_res,
            [Cmd.eUserInfoRes]: this.on_event_user_info_res,
            [Cmd.eGameStartRes]: this.on_event_game_start_res,
            [Cmd.ePlayerPowerRes]: this.on_event_power_res,
            [Cmd.eGameResultRes]: this.on_event_game_result_res,
            [Cmd.eTotalGameResultRes]: this.on_event_game_total_result_res,
            [Cmd.eUserEmojRes]: this.on_event_emoj_res,
            [Cmd.ePlayerShootRes]: this.on_event_player_shoot_res,
            [Cmd.ePlayerBallPosRes]: this.on_event_ball_pos_res,
            [Cmd.eDessolveRes]: this.on_event_desolve_res,
            [Cmd.eBackRoomRes]: this.on_event_back_room_res,
        }
    }

    public static getInstance() {
        return RobotGameModel.Instance;
    }

    public recv_cmd_msg(session: any, stype: number, ctype: number, utag: number, proto_type: number, raw_cmd: Buffer) {
        Log.info("recv_cmd_msg: stype:", StypeName[stype], " ,cmdName: ", CmdName[ctype], " ,utag: ", utag);
        if (this._cmd_handler_map[ctype]) {
            this._cmd_handler_map[ctype].call(this, session, utag, proto_type, raw_cmd);
        }
    }

    // send match to game server
    private on_player_login_logic_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer){
        Log.info("hcc>>on_player_login_logic_res.....,utag: ", utag);
        RobotSend.send_game(session, Cmd.eUserGameInfoReq, utag);
        RobotSend.send_game(session, Cmd.eRoomListConfigReq, utag);
        RobotSend.send_game(session, Cmd.eGetRoomStatusReq,utag);
    }

    private on_player_status_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (res_body && res_body.status == Response.OK){ //at room
            RobotSend.send_game(session, Cmd.eBackRoomReq, utag);
        }else{ //not at room, free
            RobotGameInterface.go_to_match_game(session, utag);
        }
    }

    //as soon as match success, send ready to game server
    private on_event_match_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer){
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if(res_body && res_body.status == Response.OK){
            if (res_body.matchsuccess){
                setTimeout(() => {
                    RobotSend.send_game(session, Cmd.eUserReadyReq,utag);
                }, RobotListConfig.READY_DELAY_TIME);
            }
        }
    }

    private on_event_user_info_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if(res_body){
            let userinfo = res_body.userinfo;
            if(userinfo){
                for(let key in userinfo){
                    let info = userinfo[key];
                    let numberid = info.numberid;
                    let userinfostring = info.userinfostring;
                    if (userinfostring){
                        let userinfoObj = JSON.parse(userinfostring);
                        if (userinfoObj){
                            let info_uid = userinfoObj.uid;
                            if (info_uid == utag){
                                RobotMgr.getInstance().add_robot_by_uinfo(userinfoObj); //不会重复添加
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private on_event_game_start_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {

    }

    private on_event_power_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let RobotMgrIns = RobotMgr.getInstance();
        let robot = RobotMgrIns.get_robot(utag) as Robot;
        if(robot){
            let robot_seatid = robot.get_seatid();
            if (!util.isNullOrUndefined(robot_seatid)){
                let res_body = ProtoManager.decode_cmd(proto_type,raw_cmd);
                if(res_body && res_body.powers){
                    for(let key in res_body.powers){
                        let res_seatid = res_body.powers[key].seatid;
                        let res_power = res_body.powers[key].power;
                        if (robot_seatid == res_seatid && res_power == PlayerPower.canPlay){
                            let other_pos:any = RobotMgrIns.get_other_pos(utag);
                            let req_body = {
                                seatid: robot_seatid,
                                posx: String(100),
                                posy: String(200),
                                shootpower: Number(1000),
                            }
                            if(!util.isNullOrUndefined(other_pos)){ //往敌人方向射击
                                req_body = {
                                    seatid: robot_seatid,
                                    posx: String(other_pos.posx),
                                    posy: String(other_pos.posy),
                                    shootpower: Number(1000),
                                }
                            }
                            setTimeout(() => {
                                RobotSend.send_game(session, Cmd.ePlayerShootReq,utag, req_body);
                            }, RobotListConfig.SHOOT_DELAY_TIME);
                            break;
                        }
                    }
                }
            }
        }
    }

    private on_event_game_result_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            let isfinal =  res_body.isfinal;
            if (util.isNullOrUndefined(isfinal) || isfinal == false){
                RobotSend.send_game(session, Cmd.eUserReadyReq, utag);
            }
        }
        RobotGameInterface.send_emoj_random_timeout(session, utag, 1000);
    }

    private on_event_game_total_result_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        RobotGameInterface.go_to_match_game(session, utag);
    }

    private on_event_emoj_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
    }

    private on_event_player_shoot_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {

    }

    private on_event_ball_pos_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (res_body){
            let positions = res_body.positions;
            if (positions){
                RobotMgr.getInstance().set_positions(utag, positions);
                Log.info("on_event_ball_pos_res: " , utag);
            }
        }
        RobotGameInterface.send_emoj_random_timeout(session, utag, 1000);
    }

    private on_event_desolve_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (res_body) {
            if(res_body.status == Response.OK){
                RobotGameInterface.go_to_match_game(session, utag);
            }
        }
    }

    private on_event_back_room_res(session: any, utag: number, proto_type: number, raw_cmd: Buffer) {
        let res_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (res_body && res_body.status == Response.OK){
            RobotSend.send_game(session, Cmd.eCheckLinkGameReq,utag);
        }
    }
}

export default RobotGameModel;