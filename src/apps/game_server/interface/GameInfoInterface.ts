//游戏服务信息,商城,兑换,相关协议处理
import Player from '../cell/Player';
import Log from '../../../utils/Log';
import MySqlGame from '../../../database/MySqlGame';
import GameHoodleConfig from "../config/GameHoodleConfig";
import Response from '../../protocol/Response';
import ArrayUtil from "../../../utils/ArrayUtil";
import PlayerManager from '../manager/PlayerManager';
import ProtoManager from '../../../netbus/ProtoManager';
import StoreConfig from '../config/StoreConfig';
import querystring from 'querystring';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';

let playerMgr: PlayerManager = PlayerManager.getInstance();

class GameInfoInterface {

    ////////////////////////////////////////
    ///本地接口
    ////////////////////////////////////////
    //更新玩家弹珠接口, 只更新到玩家缓存，没更新到数据库
    private static user_update_ball_info(player: Player, updatetype: number, level: number, count: number): boolean {
        let compose_count: number   = GameHoodleConfig.BALL_COPOSE_NUM;
        let key_str: string         = GameHoodleConfig.BALL_SAVE_KEY_STR;
        let uball_obj_player: any   = {};
        let is_success: boolean     = false;

        try {
            uball_obj_player = JSON.parse(player.get_uball_info());
        } catch (error) {
            Log.error(error);
            return false;
        }

        // Log.info("hcc>>111," , uball_obj_player);
        let level_key_str = key_str + level;
        if (updatetype == GameHoodleConfig.BALL_UPDATE_TYPE.SELL_TYPE) { //售卖
            let ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) > 0) {
                uball_obj_player[level_key_str] = Number(ball_count) - 1;
                is_success = true;
            }
        } else if (updatetype == GameHoodleConfig.BALL_UPDATE_TYPE.COMPOSE_TYPE) { //合成
            let ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) >= compose_count) {
                uball_obj_player[level_key_str] = String(Number(ball_count) - compose_count);
                level_key_str = key_str + String(level + 1);
                if (uball_obj_player[level_key_str]) {
                    uball_obj_player[level_key_str] = String(Number(uball_obj_player[level_key_str]) + 1);;
                } else {
                    uball_obj_player[level_key_str] = "1";
                }
                is_success = true;
            }
        } else if (updatetype == GameHoodleConfig.BALL_UPDATE_TYPE.ADD_TYPE) { //增加弹珠
            let ball_count = uball_obj_player[level_key_str];
            if (ball_count) {
                uball_obj_player[level_key_str] = String(Number(ball_count) + count);;
            } else {
                uball_obj_player[level_key_str] = String(count);
            }
            is_success = true;
        } else if (updatetype == GameHoodleConfig.BALL_UPDATE_TYPE.REDUCE_TYPE) { //减少弹珠
            let ball_count = uball_obj_player[level_key_str];
            if (ball_count && Number(ball_count) >= count) {
                uball_obj_player[level_key_str] = Number(ball_count) - count;
                is_success = true;
            }
        }

        if (is_success) {
            player.set_uball_info(JSON.stringify(uball_obj_player));
        }
        return is_success;
    }

    ////////////////////////////////////////
    ///对外接口
    ////////////////////////////////////////
    
    //获取游戏服务信息
    static async do_player_get_ugame_info(utag:number){
        /*
        let player: Player = playerMgr.get_player(utag);
        let data_game:any = await MySqlGame.get_ugame_uchip_by_uid(utag);
        if (data_game){
            let data_game_len = ArrayUtil.GetArrayLen(data_game);
            if (data_game_len > 0) {
                // Log.info("hcc>>on_user_get_ugame_info1111>>", data_game[0], "data_game: ", data_game);
                let ugameInfo = data_game[0];
                let ugameInfoStr = JSON.stringify(ugameInfo);
                let body = {
                    status: Response.OK,
                    userinfostring: ugameInfoStr,
                }
                player.set_ugame_info(ugameInfo);
                player.send_cmd(GameHoodleProto.XY_ID.eUserGameInfoRes, body);
                return;
            }else{
                let ret_insert:any = await MySqlGame.insert_ugame_user(utag, GameHoodleConfig.KW_BORN_EXP, GameHoodleConfig.KW_BORN_CHIP);
                if (ret_insert){
                    let data_game_ins_get:any = await MySqlGame.get_ugame_uchip_by_uid(utag);
                    if (data_game_ins_get && data_game_ins_get.length > 0){
                        // Log.info("hcc>>on_user_get_ugame_info3333>>", data_game_ins_get[0]);
                        let ugameInfo = data_game_ins_get[0];
                        let ugameInfoStr = JSON.stringify(ugameInfo);
                        let body = {
                            status: Response.OK,
                            userinfostring: ugameInfoStr,
                        }
                        player.set_ugame_info(ugameInfo);
                        player.send_cmd(GameHoodleProto.XY_ID.eUserGameInfoRes, body);
                        return;
                    }
                }
            }
        }
        player.send_cmd(GameHoodleProto.XY_ID.eUserGameInfoRes, { status: Response.INVALIDI_OPT });
        */
    }

    //获取弹珠信息
    static async do_player_get_ball_info(utag:number) {
        let player:Player = playerMgr.get_player(utag);
        let sql_ret:any = await MySqlGame.get_ugame_uball_info(player.get_uid());
        if (sql_ret){
            let ret_len = ArrayUtil.GetArrayLen(sql_ret);
            if (ret_len > 0){
                try {
                    let info = sql_ret[0];
                    let uball_info_obj = querystring.decode(info.uball_info);
                    let uball_json = JSON.stringify(uball_info_obj);
                    let body = {
                        status: Response.OK,
                        userballinfostring: uball_json,
                    }
                    // Log.info("hcc>>on_ser_ball_info: ", uball_json);
                    player.send_cmd(GameHoodleProto.XY_ID.eUserBallInfoRes, body);
                    player.set_uball_info(uball_json);
                    return;
                } catch (error) {
                    Log.error(error);
                }
            }
        }
        player.send_cmd(GameHoodleProto.XY_ID.eUserBallInfoRes, { status: Response.INVALIDI_OPT });
    }

    //兑换，卖出，等更新弹珠
    static async do_player_update_ball_info(utag: number, proto_type: number, raw_cmd: any){
        let player: Player = playerMgr.get_player(utag);
        let data_body:any = ProtoManager.decode_cmd(proto_type, raw_cmd);
        let up_type: number = data_body.updatetype;
        let level: number   = data_body.level;
        let count: number   = data_body.count;
        if (up_type == GameHoodleConfig.BALL_UPDATE_TYPE.SELL_TYPE){//卖出, 需要定义价格表,暂时还不做 TODO
            
        } else if (up_type == GameHoodleConfig.BALL_UPDATE_TYPE.COMPOSE_TYPE){ //合成
            let is_success: boolean = GameInfoInterface.user_update_ball_info(player, up_type, level, count);
            if (is_success) {
                let resultObj = { level: level + 1}
                let tmp_ball_json = player.get_uball_info();
                let body_ball = {
                    status: Response.OK,
                    userballinfostring: tmp_ball_json,
                    resultinfo:JSON.stringify(resultObj),
                }
                
                let ret: any = await MySqlGame.update_ugame_uball_info(player.get_uid(), tmp_ball_json);
                if(ret){
                    player.send_cmd(GameHoodleProto.XY_ID.eUpdateUserBallRes, body_ball);
                    player.set_uball_info(tmp_ball_json);
                    return;
                }
            }
            player.send_cmd(GameHoodleProto.XY_ID.eUpdateUserBallRes, { status: Response.INVALIDI_OPT });
        }
    }

    //获取商城列表
    static do_player_store_list(utag:number){
        let player: Player = playerMgr.get_player(utag);
        let res_body = {
            status: Response.OK,
            storeprops: StoreConfig.getInstance().get_store_config(),
        }
        player.send_cmd(GameHoodleProto.XY_ID.eStoreListRes, res_body);
    }

    //玩家购买
    static async do_player_buy_things(utag:number, proto_type:number, raw_cmd:any){
        let player: Player = playerMgr.get_player(utag);
        let req_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (req_body) {
            let storeConfig = StoreConfig.getInstance().get_store_config();
            let propsvrindex = req_body.propsvrindex;
            for (let key in storeConfig) {
                let shopInfo = storeConfig[key];
                if (shopInfo.propsvrindex == propsvrindex) {
                    let propprice   = shopInfo.propprice;
                    let propcount   = shopInfo.propcount;
                    let propinfo    = JSON.parse(shopInfo.propinfo);
                    if (Number(player.get_uchip()) >= propprice) {
                        let ret:any = await MySqlGame.add_ugame_uchip(player.get_uid(), propprice * (-1));
                        if (ret){
                            // player.set_uchip(player.get_uchip() - propprice);
                            // Log.info("hcc>>write_player_chip success", player.get_unick());
                            let is_success: boolean = GameInfoInterface.user_update_ball_info(player, GameHoodleConfig.BALL_UPDATE_TYPE.ADD_TYPE, propinfo.level, propcount);
                            if (is_success){
                                let update_ret: any = await MySqlGame.update_ugame_uball_info(player.get_uid(), player.get_uball_info());
                                if (update_ret){
                                    // Log.info("hcc>>write_player_ball success", player.get_unick());
                                    let res_body = {
                                        status: Response.OK,
                                        propsvrindex: shopInfo.propsvrindex,
                                        propid: shopInfo.propid,
                                        propcount: shopInfo.propcount,
                                        propprice: shopInfo.propprice,
                                        propinfo: shopInfo.propinfo,
                                    }
                                    player.send_cmd(GameHoodleProto.XY_ID.eBuyThingsRes, res_body);
                                    return;
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        player.send_cmd(GameHoodleProto.XY_ID.eBuyThingsRes, { status: Response.INVALIDI_OPT });
    }

    //获取玩家配置
    static async do_player_get_user_config(utag: number) {
        let player: Player = playerMgr.get_player(utag);
        let sql_ret:any = await MySqlGame.get_ugame_config_by_uid(player.get_uid());
        if (sql_ret){
            let ret_len = ArrayUtil.GetArrayLen(sql_ret);
            if (ret_len > 0) {
                try {
                    let info = sql_ret[0];
                    let user_config_obj:any = querystring.decode(info.user_config);
                    // Log.info("hcc>>do_player_get_user_config: ", user_config_obj);
                    if (!user_config_obj[GameHoodleConfig.USER_BALL_LEVEL_STR]){
                        user_config_obj[GameHoodleConfig.USER_BALL_LEVEL_STR] = 1;
                    }
                    let body = {
                        status: Response.OK,
                        userconfigstring: JSON.stringify(user_config_obj),
                    }
                    player.send_cmd(GameHoodleProto.XY_ID.eUserConfigRes, body);
                    player.set_user_config(user_config_obj);
                    return;
                } catch (error) {
                    Log.error(error);
                    return;
                }
            } 
        }
        player.send_cmd(GameHoodleProto.XY_ID.eUserConfigRes, { status: Response.INVALIDI_OPT });
    }

    //使用弹珠
    static async do_player_use_hoodleball(utag: number, proto_type: number, raw_cmd: any) {
        let player: Player = playerMgr.get_player(utag);
        let req_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if(req_body){
            let balllevel = req_body.balllevel;
            let ball_obj = JSON.parse(player.get_uball_info());

            if (balllevel){
                let keyStr = GameHoodleConfig.BALL_SAVE_KEY_STR + balllevel;
                if (ball_obj[keyStr]){
                    let userConfig = player.get_user_config();
                    userConfig[GameHoodleConfig.USER_BALL_LEVEL_STR] = balllevel;
                    player.set_user_config(userConfig);
                    let body = {
                        status: Response.OK,
                        balllevel: Number(balllevel),
                    }
                    player.send_cmd(GameHoodleProto.XY_ID.eUseHoodleBallRes,body);
                    //更新数据库
                    let result:any = await MySqlGame.update_ugame_user_config(player.get_uid(), player.get_user_config());
                    if (result){
                        // Log.info("hcc>>update_ugame_user_config success ,ret: " , result);
                        return;
                    }
                }
            }
        }
        player.send_cmd(GameHoodleProto.XY_ID.eUseHoodleBallRes, { status: Response.INVALIDI_OPT });
    }
}

export default GameInfoInterface;