import Room from './Room';
import ArrayUtil from '../../../utils/ArrayUtil';
import Player from './Player';
import Log from '../../../utils/Log';
import { UserState, PlayerPower, GameState } from './config/State';
import RoomManager from './RoomManager';
import { Cmd } from '../../protocol/GameHoodleProto';
import GameHoodleConfig from './config/GameHoodleConfig';
import Response from '../../protocol/Response';
import GameFunction from './interface/GameFunction';
import { RoomListConfig } from './config/RoomListConfig';

class MatchManager {
    private static readonly Instance: MatchManager = new MatchManager();

    private _match_list: any    = {}        // uid->player  匹配列表，还没进入匹配的人， inview状态
    private _in_match_list: any = {}        // uid->player  匹配到的人数, matching 状态
    private _zoom_list:any      = {}        //区间列表

    /*
        _zoom_list:{
            [1]:{
                match_list:{}
                in_match_list:{}
            }，

             [1]:{
                match_list:{}
                in_match_list:{}
            }，

             [1]:{
                match_list:{}
                in_match_list:{}
            }，
        }

    */

    private constructor(){
        for(let key in RoomListConfig){
            let conf = RoomListConfig[key];
            this._zoom_list[conf.roomlevel] = {};
            this._zoom_list[conf.roomlevel].match_list = {}
            this._zoom_list[conf.roomlevel].in_match_list = {}
        }
    }

    public static getInstance(){
        return MatchManager.Instance;
    }

    //开始匹配
    start_match(){
        let _this = this;
        //先找没满人的房间，再找匹配列表中的人
        setInterval(function() {
            let not_full_room = _this.get_not_full_room();
            if(not_full_room){//查找人没满的房间
                let player = _this.get_matching_player();
                if (!player){
                    player = _this.get_in_matching_player();
                }
                if(player){
                    let is_success = not_full_room.add_player(player);
                    if(is_success){
                        _this.send_match_player(not_full_room.get_all_player());
                        player.set_offline(false);
                        _this.set_room_host(not_full_room);
                        let body = {
                            status: Response.OK,
                            matchsuccess: true,
                        }
                        player.send_cmd(Cmd.eUserMatchRes,body);
                        GameFunction.broadcast_player_info_in_rooom(not_full_room, player);
                        let tmp_match_list:any = {}
                        tmp_match_list[player.get_uid()] = player;
                        _this.del_match_success_player_from_math_list(tmp_match_list);//从待匹配列表删除
                        _this.del_in_match_player(tmp_match_list);
                    }
                }else{
                    _this.do_match_player();
                }
            }else{//从匹配列表中查找正在匹配中的人
                _this.do_match_player();
            }
        //    _this.log_match_list()
        }.bind(this), GameHoodleConfig.MATCH_INTERVAL);
    }

    do_match_player(){
        let player = this.get_matching_player(); //待匹配列表，还没正式进入匹配
        if (player) {
            let match_count = ArrayUtil.GetArrayLen(this._in_match_list);
            if (match_count < GameHoodleConfig.MATCH_GAME_RULE.playerCount) {
                let ret = this.add_player_to_in_match_list(player);//加入正式匹配列表
                if (ret) {
                    let tmp_in_match_list = this._in_match_list
                    let match_count = ArrayUtil.GetArrayLen(this._in_match_list);
                    if (match_count > 1){ //这里也可能包括自己，不再发送两次
                        this.send_match_player(tmp_in_match_list);//匹配到一个玩家 ，发送到客户端
                    }
                    Log.info("hcc>>get_in_match_player_count>> ", match_count);
                    if (match_count >= GameHoodleConfig.MATCH_GAME_RULE.playerCount) { //匹配完成
                        Log.info("hcc>>match success")
                        this.on_server_match_success(tmp_in_match_list);//发送到客户端，服务端已经匹配完成
                        this.del_match_success_player_from_math_list(tmp_in_match_list);//从待匹配列表删除
                        this.del_in_match_player(tmp_in_match_list); //从匹配完成列表中删除
                    }
                }
            }
        }
    }

    //创建房间，进入玩家，发送到发送到客户端
    //in_match_list:匹配成功玩家 Matching
    on_server_match_success(in_match_list?:any){
        if(!in_match_list){
            in_match_list = this._in_match_list;
        }
        let room:Room = RoomManager.getInstance().alloc_room();
        room.set_game_rule(JSON.stringify(GameHoodleConfig.MATCH_GAME_RULE));
        room.set_is_match_room(true);
        // Log.info("hcc>>in_match_list len: " , ArrayUtil.GetArrayLen(in_match_list))
        for(let key in in_match_list){
            let player = in_match_list[key];
            player.set_offline(false);
            if(!room.add_player(player)){
                Log.warn("on_server_match_success enter room error")
                room.broadcast_in_room(Cmd.eUserMatchRes,{status:Response.INVALIDI_OPT});
                RoomManager.getInstance().delete_room(room.get_room_id())
                return;
            }
        }
        this.set_room_host(room);
        let body = {
            status: Response.OK,
            matchsuccess: true,
        }
        room.broadcast_in_room(Cmd.eUserMatchRes,body);
    }

    //设置房主: 匹配成功后，选择先匹配的玩家是房主
    //设置房主:room房间
    private set_room_host(room: Room) {
        let player_list = room.get_all_player();
        if (ArrayUtil.GetArrayLen(player_list) <= 0) {
            return;
        }
        let index = 0;
        for (let key in player_list) {
            index++;
            let player: Player = player_list[key];
            if (index == 1) {
                if (player) {
                    player.set_ishost(true);
                    room.set_room_host_uid(player.get_uid())
                }
            }else{
                if(player){
                    player.set_ishost(false);
                }
            }
        }
    }

    //发送匹配列表中的玩家
    send_match_player(in_match_list?:any){
        if(!in_match_list){
            in_match_list = this._in_match_list;
        }
        let userinfo_array = [];
        for(let key in in_match_list){
            let player:Player = in_match_list[key];
            if(player){
                let userinfo = {
                    numberid: String(player.get_numberid()),
                    userinfostring: JSON.stringify(player.get_player_info()),
                }
                userinfo_array.push(userinfo);
            }
        }

        let body = {
            status: Response.OK,
            matchsuccess: false,
            userinfo: userinfo_array,
        }

        for(let key in in_match_list){
            let player:Player = in_match_list[key];
            if(player){
                player.send_cmd(Cmd.eUserMatchRes,body)
            }
        }
    }

    //获取正在等待列表中，未进入匹配的玩家  inview状态
    get_matching_player(){
        for(let key in this._match_list){
            let p:Player = this._match_list[key];
            if(p.get_user_state() == UserState.InView){
                return p;
            }
        }
    }

    get_in_matching_player(){
        for (let key in this._in_match_list) {
            let p: Player = this._in_match_list[key];
            if (p.get_user_state() == UserState.MatchIng) {
                return p;
            }
        }
    }

    //匹配中的列表人数 Matching 
    get_in_match_player_count():number{
        let count:number = 0;
        for(let key in this._in_match_list){
            let player:Player = this._in_match_list[key];
            if(player && player.get_user_state() == UserState.MatchIng){
                count++;
            }
        }
        return count;
    }

    //从待匹配列表中将匹配完成的人删掉
    del_match_success_player_from_math_list(in_match_list?:any){
        if(!in_match_list){
            in_match_list = this._in_match_list;
        }
        for(let key in in_match_list){
            let mplayer:Player = in_match_list[key];
            if(mplayer){
                this.del_player_from_match_list_by_uid(mplayer.get_uid());
            }
        }
    }

    //删除匹配完成列表的人 Matching状态
    del_in_match_player(in_match_list?:any){
        if(!in_match_list){
            in_match_list = this._in_match_list;
        }

        let key_set = [];
        let _this = this;
        for(let key in in_match_list){
            let player:Player = in_match_list[key];
            if(player){
                player.set_user_state(UserState.InView);
                key_set.push(player.get_uid())
            }
        }
        key_set.forEach(uid => {
            _this.del_player_from_in_match_list_by_uid(uid);
        });
        this._in_match_list = {}
    }

    //添加到待匹配列表 Inview
    add_player_to_match_list(player: Player, match_room_conf:any){
        let roomlevel = match_room_conf.roomlevel;
        Log.info("hcc>>match_room_conf:", match_room_conf);
        if (this._match_list[player.get_uid()]){
            Log.info("hcc>>player uid: " + player.get_uid() + " is already in match")
            return false;
        }
        this._match_list[player.get_uid()] = player;
        player.set_user_state(UserState.InView);
        return true;
    }

    //添加到匹配完成列表中 inview-> Matching
    add_player_to_in_match_list(player:Player){
        if(!player){
            return false;
        }

        if(player.get_user_state() != UserState.InView){
            return false;
        }

        if (this.get_in_match_player_count() >= GameHoodleConfig.MATCH_GAME_RULE.playerCount){
            return false;
        }

        if (ArrayUtil.GetArrayLen(this._in_match_list) >= GameHoodleConfig.MATCH_GAME_RULE.playerCount){
            return false;
        }

        this._in_match_list[player.get_uid()] = player;
        player.set_user_state(UserState.MatchIng);
        return true;
    }

    //从待匹配的列表中删除 inview
    del_player_from_match_list_by_uid(uid:number){
        let player:Player = this._match_list[uid];
        if(player){
            player.set_user_state(UserState.InView);
            this._match_list[uid] = null;
            delete this._match_list[uid];
            return true;
        }
        return false;
    }
    
    //从匹配中的列表中删除 inview
    del_player_from_in_match_list_by_uid(uid:number){
        let player:Player = this._in_match_list[uid];
        if(player){
            player.set_user_state(UserState.InView);
            this._in_match_list[uid] = null;
            delete this._in_match_list[uid];
            return true;
        }
        return false;
    }

    //用户取消匹配,从匹配队列和匹配中删掉
    stop_player_match(uid:number):boolean{
        let ret = this.del_player_from_match_list_by_uid(uid);
        let ret_in = this.del_player_from_in_match_list_by_uid(uid);
        return ret || ret_in;
    }

    //计算匹配列表人数 Matching
    count_match_list(){
        return ArrayUtil.GetArrayLen(this._match_list)
    }

    //打印统计列表
    log_match_list(){
        let name_str = ""
        for(let key in this._match_list){
            let player:Player = this._match_list[key];
            let uname = player.get_unick();
            name_str = name_str + uname + "  ,"
        }
        if(name_str == ""){
            name_str = "none"
        }
        Log.info( "matchlist_len: " + this.count_match_list() + " ,user:" , name_str);
    }

    /////////////////////////////////////////
    //查找房间逻辑,只找匹配房间，不找自建房
    get_not_full_room() {
        let room_list = RoomManager.getInstance().get_all_room();
        for (let key in room_list) {
            let room:Room = room_list[key];
            if (room.get_is_match_room() && room.get_player_count() < room.get_conf_player_count()) {
                if(room.get_game_state() == GameState.InView){
                    return room;
                }
            }
        }
        return null;
    }

}

export default MatchManager;