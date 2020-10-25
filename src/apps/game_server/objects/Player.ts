import NetServer from '../../../netengine/NetServer';
import Log from '../../../utils/Log';
import GameHoodleConfig from '../config/GameHoodleConfig';
import Stype from '../../protocol/Stype';
import PlayerBase from './PlayerBase';
import RedisLobby from '../../../database/RedisLobby';
import RoomManager from '../manager/RoomManager';
import querystring from 'querystring';
import State from '../../config/State';

class Player extends PlayerBase{

    //居内数据
    _user_state: any                = State.UserState.InView; //玩家状态
    _user_pos:any                   = {posx:0,posy:0}   //玩家位置 
    _user_power:number              = 0;                //玩家权限
    _user_score:number              = 0;                //玩家得分
    _user_ball_info:string          = "";               //json串，玩家小球信息

    //玩家配置（身上的装备，弹珠等级，等等）
    _user_config:any                = {};

    constructor(session: any, uid: number, proto_type: number){
        super(session, uid, proto_type);
    }

    async init_data(session: any, uid: number, proto_type: number) {
        await super.init_data(session,uid,proto_type);
        
        try {
            let config = this._game_info.user_config || "";
            this._user_config = querystring.decode(config);
            this._user_ball_info = this._game_info.uball_info;
        } catch (error) {
            Log.error("hcc>>init_data" , error);
        }

        //seatid 为uid所在数组下标+1,  seatid: [1,2,3,4]
        let room_info_obj = await this.get_room_info()
        if(room_info_obj){
            let uids = room_info_obj.uids || [];
            for (let index = 0; index < uids.length; index++) {
                if(uids[index] == this._uid){
                    this._seat_id = index+1;
                    break;
                }                
            }
        }
        return true;
    }

    /////////////////////////////////
    //获取此玩家所在房间信息
    async get_room_info() {
        let room_info_str = await RedisLobby.get_roominfo_by_uid(this._uid);
        let room_info_obj: any = {};
        try {
            room_info_obj = JSON.parse(room_info_str);
        } catch (error) {
            Log.error("get_room_info error>>", error);
        }
        return room_info_obj;
    }

    //获取次玩家所在房间id
    async get_roomid(){
        let room_info_obj = await this.get_room_info();
        if (room_info_obj){
            return room_info_obj.roomid;
        }
    }

    //获取此玩家所在房间对象
    async get_room(){
        let roomid = await this.get_roomid();
        let room = RoomManager.getInstance().get_room_by_roomid(roomid);
        return room;
    }

    //获取房间内所有玩家UID
    async get_all_uids(){
        let room_info_obj = await this.get_room_info();
        if(room_info_obj){
            return room_info_obj.uids;
        }
    }

    //发送给房间所有人
    async send_all(ctype: number, body: any, not_uid?: number) {
        let uids: Array<number> = await this.get_all_uids();
        if (uids) {
            uids.forEach(uid => {
                if (uid != not_uid) {
                    NetServer.send_cmd(this._session, Stype.S_TYPE.GameHoodle, ctype, uid, this._proto_type, body);
                }
            });
        }
    }

    //发送消息
    send_cmd(ctype: number, body: any) {
        if (!this._session) {
            Log.error("send_cmd error, session is null!!");
            return;
        }
        NetServer.send_cmd(this._session, Stype.S_TYPE.GameHoodle, ctype, this._uid, this._proto_type, body);
    }

    //小球信息
    get_uball_info(){
        return this._user_ball_info;
    }

    set_uball_info(info:string){
        this._user_ball_info = info;
    }

    //当前使用小球等级
    get_uball_level(){
        return this._user_config[GameHoodleConfig.USER_BALL_LEVEL_STR];
    }

    set_uball_level(level:number){
        this._user_config[GameHoodleConfig.USER_BALL_LEVEL_STR] = level;
    }

    //设置玩家状态
    set_user_state(user_state:number){
        this._user_state = user_state;
    }

    //获取玩家状态
    get_user_state(){
        return this._user_state;
    }

    //设置位置
    set_user_pos(pos:any){
        this._user_pos = pos;
    }

    //获取位置
    get_user_pos(){
        return this._user_pos;
    }

    set_user_power(power:number){
        this._user_power = power;
    }

    get_user_power(){
        return this._user_power;
    }

    set_user_score(score:number){
        this._user_score = score;
    }

    get_user_score(){
        return this._user_score;
    }

    //玩家信息汇总
    get_player_info() {
        let info = super.get_player_info()
        info.userstate = this._user_state;
        info.userpos = this._user_pos;
        info.userpower = this._user_power;
        info.userconfig = this._user_config;
        return info;
    }

    //清除玩家在房间内的相关信息
    clear_room_info(){
        this.set_offline(false);
        this.set_ishost(false);
        this.set_seat_id(-1);
        this.set_user_state(State.UserState.InView);
        this.set_user_power(0);
        this.set_user_score(0);
        this.set_user_pos({posx:0,posy:0});
    }
}

export default Player;