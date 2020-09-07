import ProtoManager from "../../../netbus/ProtoManager";
import GameHoodleConfig from "../../game_server/lobby_server/config/GameHoodleConfig";
import MySqlGame from "../../../database/MySqlGame";
import SystemSend from '../SystemSend';
import { Cmd } from "../../protocol/SystemProto";
import Response from '../../protocol/Response';
import ArrayUtil from "../../../utils/ArrayUtil";
import querystring from 'querystring';
import Log from "../../../utils/Log";
import * as util from 'util';

class AddUchipInterface {

    //增加玩家道具接口
    static async do_user_add_chip_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if(body){
            let propid = body.propid;
            let propcount = body.propcount;
            if (propcount <= 0){
                SystemSend.send(session, Cmd.eUserAddChipRes, utag, proto_type, { status: Response.INVALIDI_OPT });
                return;
            }
            let config = body.config;
            if (propid == GameHoodleConfig.KW_PROP_ID_COIN){
                let ret = await MySqlGame.add_ugame_uchip(utag, propcount);
                if(ret){
                    let res_body = {
                        status: Response.OK,
                        propid: propid,
                        propcount: propcount,
                        config: config,
                    }
                    SystemSend.send(session,Cmd.eUserAddChipRes,utag,proto_type,res_body);
                    return;
                }
                SystemSend.send(session, Cmd.eUserAddChipRes, utag, proto_type, {status:Response.INVALIDI_OPT});
            }else if(propid == GameHoodleConfig.KW_PROP_ID_BALL){
                if(util.isNullOrUndefined(config)){
                    return;
                }
                //config: "level:1"
                let uball_info = null;
                try {
                    uball_info = JSON.parse(config);
                } catch (error) {
                    return;
                }

                let level = uball_info.level;
                if (util.isNullOrUndefined(uball_info) || util.isNullOrUndefined(level)){
                    return;
                }
                let sql_ret: any = await MySqlGame.get_ugame_uball_info(utag);
                if (sql_ret) {
                    let ret_len = ArrayUtil.GetArrayLen(sql_ret);
                    if (ret_len > 0) {
                        try {
                            let uball_info_obj = querystring.decode(sql_ret[0].uball_info);
                            let issuccess = AddUchipInterface.user_update_ball_info(uball_info_obj, level, propcount);
                            if (issuccess){
                                let ret = await MySqlGame.update_ugame_uball_info(utag, JSON.stringify(uball_info_obj));
                                if(ret){
                                    let res_body = {
                                        status: Response.OK,
                                        propid: propid,
                                        propcount: propcount,
                                        config: config,
                                    }
                                    SystemSend.send(session, Cmd.eUserAddChipRes, utag, proto_type, res_body);
                                    return;
                                }
                            }
                        } catch (error) {
                            Log.error(error);
                        }
                    }
                }
                SystemSend.send(session, Cmd.eUserAddChipRes, utag, proto_type, { status: Response.INVALIDI_OPT });
            }
        }
    }

    //增加玩家弹珠接口, 只更新到玩家缓存，没更新到数据库
    /*
    uball_info_obj: {
        lv_1:1,
        lv_2:3,
        lv_3:4,
    }
    */
    private static user_update_ball_info(uball_info_obj:any, level: number, count: number): boolean {
        if (util.isNullOrUndefined(uball_info_obj) || util.isNullOrUndefined(level) || util.isNullOrUndefined(count)){
            return false;
        }
        let key_str: string = GameHoodleConfig.BALL_SAVE_KEY_STR;
        let uball_obj_player: any = uball_info_obj;
        let level_key_str = key_str + level;
        let ball_count = uball_obj_player[level_key_str];
        if (ball_count) {
            uball_obj_player[level_key_str] = String(Number(ball_count) + count);;
        } else {
            uball_obj_player[level_key_str] = String(count);
        }
        return true;
    }

}

export default AddUchipInterface;