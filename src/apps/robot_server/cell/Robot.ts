class Robot {
    _pos_array:Array<any> = [];
    _uinfo:any = {}

    constructor() {

    }

    set_uinfo(uinfo:any){
        this._uinfo = uinfo;
    }

    get_uinfo(){
        return this._uinfo;
    }

    get_numberid(){
        return this._uinfo.numberid;
    }

    //玩家登陆账号
    get_uname(){
        return this._uinfo.uname;
    }
    
    //玩家昵称
    get_unick(){
        return this._uinfo.unick;
    }

    //座位号ID
    get_seatid(){
        return this._uinfo.seatid;
    }

    //玩家uid，服务表示ID
    get_uid(){
        return this._uinfo.uid;
    }
    
    get_offline(){
        return this._uinfo.isoffline;
    }

    get_is_host(){
        return this._uinfo.ishost;
    }

    get_user_state(){
        return this._uinfo.userstate;
    }

    set_pos(pos_array:Array<any>){
        this._pos_array = pos_array;
    }

    get_pos(){
        return this._pos_array;
    }

    reset(){
        this._uinfo = {}
    }
}

export default Robot;