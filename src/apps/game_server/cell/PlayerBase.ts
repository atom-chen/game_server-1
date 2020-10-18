import ProtoTools from "../../../netbus/ProtoTools";
import RedisAuth from "../../../database/RedisAuth";
import RedisGame from '../../../database/RedisGame';
import ArrayUtil from '../../../utils/ArrayUtil';
import Log from "../../../utils/Log";

export default class PlayerBase {

    //玩家基础信息
    _uid: number = 0;
    _session: any = null;
    _proto_type: number = ProtoTools.ProtoType.PROTO_BUF;
    _auth_info: any = {};
    _game_info: any = {};
    _is_robot: boolean = false;

    //房间相关
    _is_off_line: boolean = false;
    _is_host: boolean = false;
    _seat_id: number = -1;

    constructor(session:any, uid:number, proto_type:number){
        this._session = session,
        this._uid = uid;
        this._proto_type = proto_type;
        // this.init_data(session,uid,proto_type);
    }

    async init_data(session:any, uid:number, proto_type:number){
        this._session = session,
        this._uid = uid;
        this._proto_type = proto_type;
        this._auth_info = await RedisAuth.get_uinfo_inredis(this._uid)
        this._game_info = await RedisGame.get_gameinfo_inredis(this._uid);
        // Log.info("hcc>>init_session: _auth_info:", this._auth_info);
        // Log.info("hcc>>init_session: _game_info:", this._game_info);
        return true;
    }

    ///////////////////////////////// auth
    
    //玩家中心信息
    async get_auth_info() {
        this._auth_info = await RedisAuth.get_uinfo_inredis(this._uid)
        return this._auth_info;
    }

    //获取uid
    get_uid() {
        return this._uid;
    }

    get_proto_type() {
        return this._proto_type;
    }

    //获取numid
    get_numberid() {
        return this._auth_info.numberid;
    }


    //账号
    get_uname() {
        return this._auth_info.uname;
    }

    //玩家名字
    get_unick() {
        return this._auth_info.unick;
    }

    /////////////////////////////////game
    async get_game_info(){
        this._game_info = await RedisGame.get_gameinfo_inredis(this._uid);
        return this._game_info
    }

    //金币
    get_uchip() {
        return this._game_info.uchip;
    }

    ///////////////////////////////// other data
    //设置是否掉线
    set_offline(is_offline: boolean) {
        this._is_off_line = is_offline;
    }

    //获取是否掉线
    get_offline() {
        return this._is_off_line;
    }

    //设置是否房主
    set_ishost(is_host: boolean) {
        this._is_host = is_host;
    }

    //获取是否房主
    get_ishost() {
        return this._is_host;
    }

    //设置玩家座位号
    set_seat_id(seatid: number) {
        this._seat_id = seatid;
    }

    //获取玩家座位号
    get_seat_id() {
        return this._seat_id;
    }

    is_robot() {
        return this._is_robot;
    }

    set_robot(is_robot: boolean) {
        this._is_robot = is_robot;
    }

    ///////////////////////
    //玩家信息汇总
    get_player_info() {
        let info = ArrayUtil.ObjClone(this._auth_info);
        ArrayUtil.ObjCat(info, this._game_info)
        info.isoffline = this._is_off_line;
        info.ishost = this._is_host;
        info.seatid = this._seat_id;
        return info;
    }
}