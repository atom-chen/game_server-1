import Player from './Player';
import Log from '../../../utils/Log';
import { GameState } from '../config/State';
import PlayerManager from '../manager/PlayerManager';

/*
roomdata = {
    roomid:877207,
    uids:[1902,1903,1904],
    game_serverid:6090,
    gamerule: '{"playerCount":2,"playCount":3}', //string
}
*/

class Room {
    _roomid:string              = "";       //房间ID
    _gamerule:string            = "";       //规则json字符串
    _player_uid_set:Array<number>  = [];    //玩家uid
    _host_player_uid:number     = -1;       //房主uid
    _is_match_room:boolean      = false;    //是否匹配房间，默认false
    _match_roomlevel:number     = 1;        //匹配房间等级

    ///////
    _game_state:number          = GameState.InView; //游戏状态
    _max_playe_count:number     = -1; //最大局数
    _cur_play_count:number      = 0; //当前局数
    
    _max_player_count:number    = -1; //最大玩家数

    //////
    _tick_count:number          = 0; //包厢最长解散时间

    constructor(roomid:string,roomdata:any){
        this.init_data(roomid,roomdata);
    }

    init_data(roomid:string, roomdata:any){
        if(!roomid || !roomdata){
            return;
        }
        this._roomid = roomid;
        this._player_uid_set = roomdata.uids;
        this.set_game_rule(roomdata.gamerule);
    }

    get_room_id(){
        return this._roomid;
    }

    set_game_rule(gamerule:string){
        this._gamerule = gamerule;
        let gameruleObj:any = {};
        try {
            gameruleObj = JSON.parse(gamerule);
        } catch (error) {
            Log.error(error);
            return;
        }
        this._max_player_count = gameruleObj.playerCount;
        this._max_playe_count = gameruleObj.playCount;
    }

    get_game_rule(){
        return this._gamerule;
    }

    get_all_player(){
        let player_set:any = {}
        let uids = this._player_uid_set;
        uids.forEach(uid => {
            let player: Player = PlayerManager.getInstance().get_player(uid);
            if(player){
                player_set[uid] = player;
            }
        })
        return player_set;
    }

    get_player_by_seatid(seatid:number){
        let player_set = this.get_all_player()
        for (const key in player_set) {
            let player: Player = player_set[key];
            if (player.get_seat_id() == seatid) {
                return player;
            }
        }
    }

    //生成一个seatid,从1->maxplayercount
    /*
    born_seatid() {
        let exist_seatid = [];
        let all_seatid = [];
        let all_player = this.get_all_player();

        for (let seatid = 1; seatid <= this._max_player_count; seatid++) {
            all_seatid[seatid] = seatid;
        }

        for (let uid in all_player) {
            let player: Player = all_player[uid];
            let seatid = player.get_seat_id();
            if (seatid != -1) {
                exist_seatid.push(seatid);
            }
        }

        for (let i = 0; i <= exist_seatid.length; i++) {
            let seatid = exist_seatid[i];
            for (let j = 1; j <= this._max_player_count; j++) {
                if (seatid == all_seatid[j]) {
                    all_seatid.splice(j, 1);
                }
            }
        }

        if (all_seatid.length > 0) {
            for (let i = 1; i <= all_seatid.length; i++) {
                let seatid = all_seatid[i];
                if (seatid && seatid != -1) {
                    return seatid;
                }
            }
        }
        return -1;
    }
    */

    //当前房间内人数
    get_cur_player_count(){
       return this._player_uid_set.length;
    }

    //房间在线人数
    get_online_max_player_count(){
        
    }

    //房间配置的最多人数
    get_max_player_count(){
        return this._max_player_count;
    }

    //配置的最多局数
    get_max_play_count(){
        return this._max_playe_count;
    }

    //当前局数
    set_cur_play_count(count:number){
        this._cur_play_count = count;
    }

    //当前局数
    get_cur_play_count():number{
        return this._cur_play_count;
    }

    set_room_host_uid(uid:number){
        this._host_player_uid = uid;
    }

    get_room_host_uid(){
        return this._host_player_uid;
    }

    is_room_host(uid:number){
        return this._host_player_uid === uid;
    }

    set_game_state(game_state:number){
        this._game_state = game_state;
    }

    get_game_state(){
        return this._game_state;
    }

    set_is_match_room(is_match:boolean){
        this._is_match_room = is_match;
    }

    get_is_match_room():boolean{
        return this._is_match_room;
    }

    set_match_roomlevel(roomlevel:number){
        this._match_roomlevel = roomlevel;
    }

    get_match_roomlevel(){
        return this._match_roomlevel;
    }

    set_tick_count(count:number){
        this._tick_count = count;
    }

    get_tick_count(){
        return this._tick_count;
    }

    have_robot_player(){
      
    }

    broadcast_in_room(ctype:number, body:any ,not_to_uid?:number){
        if(!ctype){
            return;
        }
        let all_player = this.get_all_player();
        if (not_to_uid){
            for (const key in all_player) {
                let player: Player = all_player[key];
                if(player){
                    if(player.get_uid() != not_to_uid){
                        player.send_cmd(ctype,body)
                    }
                }
            }
        }else{
            for (const key in all_player) {
                let player: Player = all_player[key];
                if(player){
                    player.send_cmd(ctype,body)
                }
            }
        }
    }
}

export default Room;