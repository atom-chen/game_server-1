import MySqlGame from "../../../database/MySqlGame";
import ArrayUtil from "../../../utils/ArrayUtil";
import RedisGame from '../../../database/RedisGame';
import Log from "../../../utils/Log";
import GameHoodleConfig from "../../game_server/config/GameHoodleConfig";
import LobbySendMsg from "../LobbySendMsg";
import LobbyProto from "../../protocol/protofile/LobbyProto";
import Response from '../../protocol/Response';

export default class GameInfoHandle {

    //查询玩家信息
    public static async do_get_ugame_info(utag: number) {
        return await RedisGame.get_gameinfo_inredis(utag);
    }

    public static async do_req_login_lobby(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let ret = await GameInfoHandle.do_check_ugame_info(utag);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_LOBINLOBBY, utag, proto_type, { status: Response.OK });
        }
    }

    //查询玩家游戏服务信息，不存在就创建
    private static async do_check_ugame_info(utag: number) {
        if(utag == 0){
            return false;
        }
        let data_game: any = await MySqlGame.get_ugame_info_by_uid(utag);
        if (data_game){
            let data_game_len = ArrayUtil.GetArrayLen(data_game);
            if (data_game_len > 0) {
                let game_info = data_game[0]
                let ret = await RedisGame.set_gameinfo_inredis(utag, game_info);
                Log.info("hcc>>on_user_get_ugame_info1111>>", game_info);
                Log.info("hcc>>ret:", ret)
                return true
            }else{
                let ret_insert: any = await MySqlGame.insert_ugame_user(utag, GameHoodleConfig.KW_BORN_EXP, GameHoodleConfig.KW_BORN_CHIP);
                if (ret_insert) {
                    let data_game2: any = await MySqlGame.get_ugame_info_by_uid(utag);
                    if (data_game2) {
                        let data_game_len2 = ArrayUtil.GetArrayLen(data_game2);
                        if (data_game_len2 > 0) {
                            let game_info2 = data_game2[0]
                            let ret = await RedisGame.set_gameinfo_inredis(utag, game_info2);
                            Log.info("hcc>>on_user_get_ugame_info1222>>", game_info2);
                            Log.info("hcc>>ret:" , ret)
                            return true
                        }
                    }
                }
            }
        }
        return false;
    }
}