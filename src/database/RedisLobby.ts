import RedisEngine from '../utils/RedisEngine';
import StringUtil from '../utils/StringUtil';
import Log from '../utils/Log';
import * as util from 'util';

let ROOMID_ROOMINFO_KEY = "ROOMID_ROOMINFO_KEY"
let UID_ROOMINFO_KEY    = "UID_ROOMINFO_KEY"
let room_id_length = 6;
/*
1. 这两个地方同时保存了roominfo_json
2. 修改的话，这两个地方同时需要修改

//////////////////////
//1. roomid->roominfo_json 映射存储方式:
//////////////////////
ROOMID_ROOMINFO_KEY =
{
    roomid_111111: {
        roomid:roomid,
        uids:[111111,222222,333333,444444],
        gamerule:"str...",
        game_server_id:1,
        ex_info:"xx",
    },
    roomid_222222: {
        ...
    },
}

///////////////////////
//2. uid->roominfo_json 映射存储方式：
///////////////////////
UID_ROOMINFO_KEY =
{
    uid_1001934: {
        roomid:roomid,
        uids:[111111,222222,333333,444444],
        gamerule:"str...",
        game_server_id:1,
        ex_info:"xx",
    },
    uid_1001935: {
        ...
    },
}
*/

export default class RedisLobby {
    private static redisEngine: RedisEngine = new RedisEngine();

    static engine() {
        return RedisLobby.redisEngine;
    }

    static connect(host?: string, port?: number, db_index?: number) {
        RedisLobby.engine().connect(host, port, db_index);
    }

    static get_roomid_key(roomid:string){
        let roomid_key = "roomid_roominfo_" + roomid;
        return roomid_key;
    }

    static get_uid_key(uid:string|number){
        let uid_key = "uid_roominfo_" + uid;
        return uid_key;
    }

    //保存 roomid->roominfo_json 映射
    //返回 boolean
    public static async save_roomid_roominfo_inredis(roomid:string , roominfo_json:string){
        let roomid_key = RedisLobby.get_roomid_key(roomid);
        let ret = await RedisLobby.engine().hset(ROOMID_ROOMINFO_KEY, roomid_key, roominfo_json);
        return ret == 1;
    }

    //根据 roomid 获取roominfo_json
    public static async get_roominfo_by_roomid(roomid: string) {
        let roomid_key = RedisLobby.get_roomid_key(roomid);
        let ret = await RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key);
        return ret;
    }

    //保存 uid->roominfo_json 映射
    //返回 boolean
    public static async save_uid_roominfo_inredis(uid:number, roominfo_json:string){
        let uid_key = RedisLobby.get_uid_key(uid);
        let ret = await RedisLobby.engine().hset(UID_ROOMINFO_KEY,uid_key, roominfo_json);
        return ret == 1;
    }

    //根据 uid 获取roominfo_json
    public static async get_roominfo_by_uid(uid: number) {
        let uid_key = RedisLobby.get_uid_key(uid);
        let ret = await RedisLobby.engine().hget(UID_ROOMINFO_KEY,uid_key);
        return ret;
    }


    //玩家是否在房间内
    //返回 boolean
    public static async uid_is_exist_in_room(uid:number){
        let uid_key = RedisLobby.get_uid_key(uid);
        let ret = await RedisLobby.engine().hget(UID_ROOMINFO_KEY,uid_key);
        return !util.isNullOrUndefined(ret);
    }

    //房间是否存在
    //返回boolean
    public static async roomid_is_exist(roomid:string){
        let allroom = await RedisLobby.get_all_roominfo();
        for (let key in allroom) {
            let room_info_json = allroom[key];
            let roominfo_obj = null;
            try {
                roominfo_obj = JSON.parse(room_info_json);
            } catch (error) {
                Log.info(error);
            }
            if (roominfo_obj == null) {
                continue;
            }
            if (String(roominfo_obj.roomid) == roomid) {
                return true;
            }
        }
        return false;
    }
    
    //增加roominfo_json内玩家
    //同时更新
    public static async add_uid_in_roominfo(roomid:string, uid:number){
        let roomid_key = RedisLobby.get_roomid_key(roomid);
        let ret = await RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key);
        if(ret){
            let roominfo_obj = JSON.parse(ret);
            let uids: Array<number> = roominfo_obj.uids;
            if (uids) {
                let index = uids.indexOf(uid);
                if(index < 0){ //没有才添加
                    uids.push(uid);
                    roominfo_obj.uids = uids;
                    //
                    let roominfo_json = JSON.stringify(roominfo_obj);
                    await RedisLobby.save_roomid_roominfo_inredis(roomid, roominfo_json);
                    //
                    uids.forEach(async uid => {
                        await RedisLobby.save_uid_roominfo_inredis(uid, roominfo_json);
                    });
                    return true;
                }
            }
        }
        return false;
    }

    //删除玩家uid和获取roominfo_json的映射
    //返回boolean
    //内部使用
    private static async delete_uid_to_roominfo(uid: number) {
        let uid_key = RedisLobby.get_uid_key(uid);
        let ret = await RedisLobby.engine().hdelete(UID_ROOMINFO_KEY, uid_key);
        return ret == 1;
    }

    //删除roominfo_json内玩家uid
    //同时更新 roominfo_json
    public static async delete_uid_in_roominfo(roomid:string, uid:number){
        let roomid_key = RedisLobby.get_roomid_key(roomid);
        let ret = await RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY,roomid_key);
        if(ret){
            let roominfo_obj = JSON.parse(ret);
            let uids:Array<number> = roominfo_obj.uids;
            if(uids){
                let index = uids.indexOf(uid);
                if(index > -1){
                    uids.splice(index,1);
                    roominfo_obj.uids = uids;

                    //如果房间没人了，就把房间删了，(room->roominfo)映射删了
                    if(uids.length <= 0){
                       await RedisLobby.delete_room(roomid);
                    }else{//如果还有人，就把房间信息更新掉
                        //
                        let roominfo_json = JSON.stringify(roominfo_obj);
                        await RedisLobby.save_roomid_roominfo_inredis(roomid,roominfo_json);
                        //
                        uids.forEach(async uid => {
                           await RedisLobby.save_uid_roominfo_inredis(uid,roominfo_json);
                        });
                    }
                }
                //再删除uid->roominfo_json 映射
                await RedisLobby.delete_uid_to_roominfo(uid);
                return true;
            }
        }
        return false;
    }

    //删除房间
    public static async delete_room(roomid:string){
        let roomid_key = RedisLobby.get_roomid_key(roomid);
        let ret = await RedisLobby.engine().hget(ROOMID_ROOMINFO_KEY, roomid_key);
        if(ret){
            let roominfo_obj = JSON.parse(ret);
            let uids: Array<number> = roominfo_obj.uids;
            uids.forEach(async uid => {
                await RedisLobby.delete_uid_to_roominfo(uid);
            });
        }
        let ret2 = await RedisLobby.engine().hdelete(ROOMID_ROOMINFO_KEY, roomid_key);
        if (ret2 == 1){
            return true;
        }
        return false;
    }

    //获取所有roomid->roominfo_json映射
    public static async get_all_roominfo(){
        return await RedisLobby.engine().hgetall(ROOMID_ROOMINFO_KEY);
    }

    //生成一个6位roomid, 如果有相同的会失败，需要再次生成
    public static async generate_roomid(){
        let new_roomid = StringUtil.random_int_str(room_id_length);
        let allroom = await RedisLobby.get_all_roominfo();
        for(let key in allroom){
            let room_info_json = allroom[key];
            let roominfo_obj = null;
            try {
                roominfo_obj = JSON.parse(room_info_json);
            } catch (error) {
                Log.info(error);
            }
            if(roominfo_obj == null){
                continue;
            }
            if (String(roominfo_obj.roomid) == new_roomid){
              return null;
            }
        }
        return new_roomid;
    }

    //TODO 根据服务的负载，进行选择哪个game_server
    public static choose_game_server(){
        return 0;
    }

}