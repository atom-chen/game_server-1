import Room from '../cell/Room';
import ArrayUtil from '../../../../utils/ArrayUtil';
import Player from '../cell/Player';
import Log from '../../../../utils/Log';
import { UserState, PlayerPower, GameState } from '../config/State';
import RoomManager from './RoomManager';
import { Cmd } from '../../../protocol/GameHoodleProto';
import GameHoodleConfig from '../config/GameHoodleConfig';
import Response from '../../../protocol/Response';
import GameFunction from '../interface/GameFunction';
import { RoomListConfig } from '../config/RoomListConfig';

let roomMgr: RoomManager = RoomManager.getInstance();

class MatchManager {
    private static readonly Instance: MatchManager = new MatchManager();
    private _zoom_list:any      = {}        //区间列表
    /*
        _zoom_list:{
            [1]:{ //roomlevel
                match_list:{}
                in_match_list:{}
            }，

             [2]:{
                match_list:{}
                in_match_list:{}
            }，

             [3]:{
                match_list:{}
                in_match_list:{}
            }，
        }

    */

    private constructor(){
        for(let key in RoomListConfig){
            let conf = RoomListConfig[key];
            this._zoom_list[conf.roomlevel] = {};
            this._zoom_list[conf.roomlevel]["match_list"] = {}
            this._zoom_list[conf.roomlevel]["in_match_list"] = {}
        }
    }

    public static getInstance(){
        return MatchManager.Instance;
    }

    //开始匹配
    start_match(){
        // 匹配逻辑
        let _this = this;
        //先找没满人的房间，再找匹配列表中的人
        let is_match_room_success = false;
        setInterval(function() {
            is_match_room_success = false;
            for (let roomlevel in _this._zoom_list) {
                let zoom = _this._zoom_list[roomlevel];
                let tmproomlevel = Number(roomlevel);
                let not_full_room = _this.get_not_full_room(tmproomlevel);
                if (not_full_room){
                    // Log.info("not_full_room111, roomid:", not_full_room.get_room_id());
                    let player = _this.get_matching_player(zoom);
                    if(!player){
                        player = _this.get_in_matching_player(zoom);
                    }
                    if(player){
                        if (roomMgr.get_room_by_uid(player.get_uid())){
                            continue;
                        }
                        if(player.is_robot() && not_full_room.have_robot_player()){
                            continue;
                        }
                        // Log.info("not_full_room222, player: " , player.get_unick());
                        let is_success = not_full_room.add_player(player);
                        if (is_success) {
                            // Log.info("not_full_room333, player: ", player.get_unick());
                            _this.send_match_player(not_full_room.get_all_player());
                            player.set_offline(false);
                            _this.set_room_host(not_full_room);
                            let body = {
                                status: Response.OK,
                                matchsuccess: true,
                            }
                            player.send_cmd(Cmd.eUserMatchRes, body);
                            GameFunction.broadcast_player_info_in_rooom(not_full_room, player);
                            _this.del_player_from_match_list_by_uid(player.get_uid(), zoom.match_list);//从待匹配列表删除
                            _this.del_player_from_in_match_list_by_uid(player.get_uid(), zoom.in_match_list);//匹配完成的列表删除
                            is_match_room_success = true;
                        }
                    }
                }
            }
            
            if (is_match_room_success == false){
                _this.do_match_player();
            }
        //    _this.log_match_list();
        }, GameHoodleConfig.MATCH_INTERVAL);
    }

    do_match_player(){
        // Log.info("do_match_player111");
        for(let roomlevel in this._zoom_list){
            let zoom = this._zoom_list[roomlevel];
            let player = this.get_matching_player(zoom);
            if(player){
                if (roomMgr.get_room_by_uid(player.get_uid())) {
                    continue;
                }
                // Log.info("do_match_player222");
                let match_count = ArrayUtil.GetArrayLen(zoom.in_match_list);
                if (match_count < GameHoodleConfig.MATCH_GAME_RULE.playerCount) {
                    let ret = this.add_player_to_in_match_list(player, zoom);//加入正式匹配列表
                    if (ret){
                        let match_count = ArrayUtil.GetArrayLen(zoom.in_match_list);
                        if(match_count > 1){
                            this.send_match_player(zoom.in_match_list);//匹配到一个玩家 ，发送到客户端
                            if (match_count >= GameHoodleConfig.MATCH_GAME_RULE.playerCount) { //匹配完成
                                this.on_server_match_success(zoom.in_match_list, Number(roomlevel));//发送到客户端，服务端已经匹配完成
                                this.del_match_success_player_from_math_list(zoom.in_match_list,zoom.match_list);//匹配完成的人（in_match_list）从待匹配列表(match_list)删除
                                this.del_in_match_player(zoom.in_match_list); //从匹配完成列表(in_match_list)中删除
                            }
                        }
                    }
                }
            }
        }
    }

    //创建房间，进入玩家，发送到发送到客户端
    //in_match_list:匹配成功玩家 Matching
    on_server_match_success(in_match_list: any, roomlevel:number){
        let room:Room = RoomManager.getInstance().alloc_room();
        room.set_game_rule(JSON.stringify(GameHoodleConfig.MATCH_GAME_RULE));
        room.set_is_match_room(true);
        room.set_match_roomlevel(roomlevel);
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
    send_match_player(in_match_list:any){
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
    //先找玩家，再找机器人
    get_matching_player(zoom:any){
        //先找玩家
        for (let key in zoom.match_list){
            let player: Player = zoom.match_list[key];
            if (player.get_user_state() == UserState.InView){
                if (!player.is_robot()){
                    return player;
                }
            }
        }
        //再找机器人
        for (let key in zoom.match_list) {
            let player: Player = zoom.match_list[key];
            if (player.get_user_state() == UserState.InView) {
                return player;
            }
        }  
    }

    //获取正在匹配中的玩家，进入匹配状态，matching状态
    //先找玩家，再找机器人
    get_in_matching_player(zoom:any){
        for (let key in zoom.in_match_list) {
            let p: Player = zoom.in_match_list[key];
            if (p.get_user_state() == UserState.MatchIng) {
                if(!p.is_robot()){
                    return p;
                }
            }
        }

        for (let key in zoom.in_match_list) {
            let p: Player = zoom.in_match_list[key];
            if (p.get_user_state() == UserState.MatchIng) {
                return p;
            }
        }
    }

    //匹配中的列表人数 Matching 
    get_in_match_player_count(zoom:any):number{
        let count:number = 0;
        for(let key in zoom.in_match_list){
            let player: Player = zoom.in_match_list[key];
            if(player && player.get_user_state() == UserState.MatchIng){
                count++;
            }
        }
        return count;
    }

    //从待匹配列表中将匹配完成的人删掉
    del_match_success_player_from_math_list(in_match_list:any, match_list:any){
        for(let key in in_match_list){
            let mplayer:Player = in_match_list[key];
            if(mplayer){
                this.del_player_from_match_list_by_uid(mplayer.get_uid(), match_list);
            }
        }
    }

    //删除匹配完成列表的人 Matching状态
    del_in_match_player(in_match_list:any){
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
            _this.del_player_from_in_match_list_by_uid(uid, in_match_list);
        });
        in_match_list = {};
    }

    //添加到待匹配列表 Inview
    add_player_to_match_list(player: Player, match_room_conf:any){
        Log.info("hcc>>match_room_conf:", match_room_conf);
        let roomlevel = match_room_conf.roomlevel;
        if(!roomlevel){
            return false;
        }

        let zoom = this._zoom_list[roomlevel]; //匹配房间区间
        if (!zoom){
            return false;
        }

        if (zoom.match_list[player.get_uid()]){
            Log.info("hcc>>player uid: " + player.get_uid() + " is already in match");
            return false;
        }
        
        if (roomMgr.get_room_by_uid(player.get_uid())) {
            Log.info("hcc>>player uid: " + player.get_uid() + " is already in room");
            return false;
        }

        zoom.match_list[player.get_uid()] = player;
        player.set_user_state(UserState.InView);
        return true;
    }

    //添加到匹配完成列表中 inview-> Matching
    add_player_to_in_match_list(player:Player, zoom:any){
        if(!player){
            return false;
        }

        if(player.get_user_state() != UserState.InView){
            return false;
        }

        if (roomMgr.get_room_by_uid(player.get_uid())) {
            Log.info("hcc>>player uid: " + player.get_uid() + " is already in room");
            return false;
        }

        if (this.get_in_match_player_count(zoom) >= GameHoodleConfig.MATCH_GAME_RULE.playerCount){
            return false;
        }

        if (ArrayUtil.GetArrayLen(zoom.in_match_list) >= GameHoodleConfig.MATCH_GAME_RULE.playerCount){
            return false;
        }

        //不能同时匹配两个机器人
        if(player.is_robot()){
            for (let idx in zoom.in_match_list){
                let in_player:Player = zoom.in_match_list[idx];
                if (in_player.is_robot()){
                    return false;
                }
            }
        }

        zoom.in_match_list[player.get_uid()] = player;
        player.set_user_state(UserState.MatchIng);
        return true;
    }

    //从待匹配的列表中删除 inview
    del_player_from_match_list_by_uid(uid:number, match_list:any){
        let player:Player = match_list[uid];
        if(player){
            player.set_user_state(UserState.InView);
            match_list[uid] = null;
            delete match_list[uid];
            return true;
        }
        return false;
    }
    
    //从匹配中的列表中删除 inview
    del_player_from_in_match_list_by_uid(uid:number, in_match_list:any){
        let player:Player = in_match_list[uid];
        if(player){
            player.set_user_state(UserState.InView);
            in_match_list[uid] = null;
            delete in_match_list[uid];
            return true;
        }
        return false;
    }

    //用户取消匹配,从匹配队列和匹配中删掉
    stop_player_match(uid:number):boolean{
        let result = false;
        for (let roomlevel in this._zoom_list) {
            let zoom = this._zoom_list[roomlevel];
            let ret = this.del_player_from_match_list_by_uid(uid, zoom.match_list);
            let ret_in = this.del_player_from_in_match_list_by_uid(uid, zoom.in_match_list);
            let  tmpresult = ret || ret_in;
            if (tmpresult){
                result = true;
            }
        }
        return result;
    }

    //计算匹配列表人数 inview
    count_match_list(){
        let count = 0;
        for(let roomlevel in this._zoom_list){
            let zoom = this._zoom_list[roomlevel];
            let match_list_count = ArrayUtil.GetArrayLen(zoom.match_list);
            count += match_list_count;
        }
        return count;
    }

    //匹配状态玩家数量 matching
    count_in_match_list(){
        let count = 0;
        for (let roomlevel in this._zoom_list) {
            let zoom = this._zoom_list[roomlevel];
            let match_list_count = ArrayUtil.GetArrayLen(zoom.in_match_list);
            count += match_list_count;
        }
        return count;
    }

    //打印统计列表
    log_match_list(){
        let name_str = ""
        let in_match_name_str = ""
        for (let roomlevel in this._zoom_list) {
            let zoom = this._zoom_list[roomlevel];
            for (let key in zoom.match_list){
                let player:Player = zoom.match_list[key];
                let uname = player.get_unick();
                let state = player.get_user_state();
                name_str = name_str + "[" + uname + ",lev:" + roomlevel + "] "// ",state:" + state +  "  ,"
            }
            for (let key in zoom.in_match_list) {
                let player: Player = zoom.in_match_list[key];
                let uname = player.get_unick();
                let state = player.get_user_state();
                in_match_name_str = in_match_name_str + "[" + uname + ",lev:" + roomlevel + "] " //+ ",state:" + state + "  ,"
            }
            
        }
        if(name_str == ""){
            name_str = "none"
        }

        if (in_match_name_str == ""){
            in_match_name_str = "none";
        }
        Log.info("\n");
        Log.info("matchlist_len:" + this.count_match_list() + " ==>" + name_str);
        Log.info("in_matchlist_len:" + this.count_in_match_list() + " ==>" + in_match_name_str);
    }

    /////////////////////////////////////////
    //查找房间逻辑,只找匹配房间，不找自建房
    get_not_full_room(roomlevel:number) {
        let room_list = RoomManager.getInstance().get_all_room();
        for (let key in room_list) {
            let room:Room = room_list[key];
            // Log.info("playercount: ", room.get_player_count(), " ,confplayercount: ", room.get_conf_player_count());
            if (room.get_match_roomlevel() == roomlevel){
                if (room.get_is_match_room() && room.get_player_count() < room.get_conf_player_count()) {
                    if(room.get_game_state() == GameState.InView){
                        return room;
                    }
                }
            }
        }
        return null;
    }

}

export default MatchManager;