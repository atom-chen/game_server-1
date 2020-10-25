//游戏相关辅助函数
import Room from "../objects/Room";
import Player from "../objects/Player";
import Log from '../../../utils/Log';
import StringUtil from '../../../utils/StringUtil';
import MySqlGame from '../../../database/MySqlGame';
import GameHoodleConfig from "../config/GameHoodleConfig";
import State from '../../config/State';
import ArrayUtil from "../../../utils/ArrayUtil";
import RedisGame from "../../../database/RedisGame";

class GameFunction {

    static _startx_left_array   = [-480,-400,-300,-200,-100];
    static _startx_right_array  = [480,400,300,200,100];
    static _starty_up_array     = [900,700,500,300,100];
    static _starty_down_array   = [-900,-700,-500,-300,-100];

    //检测游戏开始
    static check_game_start(room: Room) {
        let player_set = room.get_all_player();
        let ready_player_count = 0;
        for (let uid in player_set) {
            let player: Player = player_set[uid];
            if (player) {
                if (player.get_user_state() == State.UserState.Ready) {
                    ready_player_count++;
                }
            }
        }
        Log.info("check_game_start: readycount: ", ready_player_count);
        if (ready_player_count == room.get_max_player_count()) {
            return true;
        }
        return false;
    }

    //设置房间内所有玩家状态
    static set_all_player_state(room: Room, user_state: number) {
        let player_set = room.get_all_player();
        for (let uid in player_set) {
            let player: Player = player_set[uid];
            if (player) {
                player.set_user_state(user_state);
            }
        }
    }

    //生成初始坐标(为了不让小球开局位置在一块)
    public static generate_start_pos(pos_index:number):any{
        // let posx = StringUtil.random_int(-540 , 540);
        // let posy = StringUtil.random_int(-960 , 960);
        let posx_random:number = 0;
        let posy_random:number = 0;
        if(pos_index %2 == 0){
            let array_len = GameFunction._startx_left_array.length;
            posx_random = GameFunction._startx_left_array[StringUtil.random_int(0,array_len-1)];
            
            array_len = GameFunction._starty_up_array.length;
            posy_random = GameFunction._starty_up_array[StringUtil.random_int(0,array_len-1)];
        }else{
            let array_len = GameFunction._startx_right_array.length;
            posx_random = GameFunction._startx_right_array[StringUtil.random_int(0,array_len-1)];

            array_len = GameFunction._starty_down_array.length;
            posy_random = GameFunction._starty_down_array[StringUtil.random_int(0,array_len-1)];
        }

        let startx_pos = posx_random < 0 ? posx_random : 0;
        let endx_pos = posx_random > 0 ? posx_random : 0;

        let starty_pos = posy_random < 0 ? posy_random : 0;
        let endy_pos = posy_random > 0 ? posy_random : 0;

        let posx = StringUtil.random_int(startx_pos, endx_pos);
        let posy = StringUtil.random_int(starty_pos , endy_pos);
        return {posx: posx, posy: posy};
    }

    //清除玩家当局数据
    public static clear_all_player_cur_data(room: Room){
        let player_set = room.get_all_player();
        for(let uid in player_set){
            let player:Player = player_set[uid];
            if(player){
                player.set_user_power(State.PlayerPower.canNotPlay);
                player.set_user_pos({posx:0,posy:0})
            }
        }
    }

    //设置玩家初始权限
    public static set_player_start_power(room: Room):boolean{
        let can_play_seatid = StringUtil.random_int(1, room.get_max_player_count());
        let player_set = room.get_all_player();
        let player_array = [];
        for(let key in player_set){
            player_array.push(player_set[key]);
        }
        let player = player_array[can_play_seatid - 1];
        if(!player){
            Log.error("hcc>>set_player_start_power player is null ,seatid: " , can_play_seatid);
            return false;
        }
        player.set_user_power(State.PlayerPower.canPlay);
        // Log.info("hcc>>set_player_start_power seatid: " + player.get_seat_id() , " ,power: " + player.get_user_power());
        return true;
    }

    //计算玩家权限
    public static set_next_player_power(room: Room){
        let player_set = room.get_all_player();
        let next_power_seatid = -1;
        for(let uid in player_set){
            let player:Player = player_set[uid];
            if(player){
              let power = player.get_user_power();
                if (power == State.PlayerPower.canPlay){
                    player.set_user_power(State.PlayerPower.canNotPlay);
                 next_power_seatid = player.get_seat_id() + 1;
                 if(next_power_seatid > room.get_max_player_count()){
                     next_power_seatid = next_power_seatid % room.get_max_player_count();
                 }
                //  Log.info("hcc>> cur power seat: " , player.get_seat_id());
                //  Log.info("hcc>> next power seat: " , next_power_seatid);
                 break;
              }
            }
        }
        
        if(next_power_seatid == -1){
            Log.error("error: next_power_seatid is -1");
            return;
        }

        for(let uid in player_set){
            let player:Player = player_set[uid];
            if(player){
                if(player.get_seat_id() == next_power_seatid){
                    player.set_user_power(State.PlayerPower.canPlay);
                }else{
                    player.set_user_power(State.PlayerPower.canNotPlay);
                }
            }
        }
    }

    //计算玩家金币，设置到player，写入数据库
    //考虑不够减的情况(扣除只够扣的金币)
    public static async cal_player_chip_and_write(room:Room){
        if(!room){
            return;
        }
        let player_set = room.get_all_player();
        for(let key in player_set){
            let player:Player = player_set[key];
            if (player){
                let score = player.get_user_score();
                let gold_win = score * GameHoodleConfig.KW_WIN_RATE;
                if(gold_win != 0){
                    let player_cur_chip = player.get_uchip();
                    if(gold_win < 0){
                        if(Math.abs(gold_win) > Math.abs(player_cur_chip)){
                            gold_win = (-1)*player_cur_chip;
                        }
                    }
                    // Log.info(player.get_unick(),"hcc>>cal_player_chip_and_write: score: " , score, " ,gold_win: " , gold_win, " ,cur_chip: " , player.get_uchip()," ,after add: " , (player.get_uchip() + gold_win));
                    // player.set_uchip(player.get_uchip() + gold_win);
                    let ret = await MySqlGame.add_ugame_uchip(player.get_uid(),gold_win); //这里加await会阻塞，玩家会先被踢了,所以在外面也要加await
                    if (ret){
                        Log.info("hcc>> name: ", player.get_unick(), "add ", gold_win  ," coin success!!");
                        let data_game: any = await MySqlGame.get_ugame_info_by_uid(player.get_uid());
                        if (data_game) {
                            let data_game_len = ArrayUtil.GetArrayLen(data_game);
                            if (data_game_len > 0) {
                                RedisGame.set_gameinfo_inredis(player.get_uid(), data_game[0]);
                            }
                        }
                    }
                }
            }
        }
    }
}

export default GameFunction;