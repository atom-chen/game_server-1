//接收redis消息

import Log from "../../utils/Log";
import PlayerManager from "./manager/PlayerManager";
import RedisEvent from '../../database/RedisEvent';
import GameServerData from "./GameServerData";
import RoomManager from "./manager/RoomManager";
import Room from './objects/Room';
import RedisLobby from '../../database/RedisLobby';
import Player from './objects/Player';
import GameSendInfo from "./handler/SendLogicInfo";
import SendLogicInfo from "./handler/SendLogicInfo";

let playerMgr: PlayerManager = PlayerManager.getInstance();
let roomMgr: RoomManager = RoomManager.getInstance();

/*
roomdata = {
    roomid:877207,
    uids:[1902,1903,1904],
    game_serverid:6090,
    gamerule: '{"playerCount":2,"playCount":3}', //string
    game_state : 1,
}
*/

export default class GameRedisMsg {
    private static readonly Instance: GameRedisMsg = new GameRedisMsg();
    _redis_handler_map: any = {};

    public static getInstance() {
        return GameRedisMsg.Instance;
    }

    constructor(){
        this._redis_handler_map = {
            [RedisEvent.redis_lobby_channel_msg.create_room]: this.on_redis_create_room,
            [RedisEvent.redis_lobby_channel_msg.back_room]: this.on_redis_back_room,
            [RedisEvent.redis_lobby_channel_msg.dessolve_room]: this.on_redis_dessolve_room,
            [RedisEvent.redis_lobby_channel_msg.exit_room]: this.on_redis_exit_room,
            [RedisEvent.redis_lobby_channel_msg.join_room]: this.on_redis_join_room,
            [RedisEvent.redis_lobby_channel_msg.lobby_user_offinle]: this.on_redis_user_offline,
        }
    }

    public recv_redis_msg(message: string) {
        try {
            let body = JSON.parse(message);
            if (body) {
                let xy_name = body.xy_name;
                let uid = body.uid;
                let server_key = body.game_serverid;
                if (xy_name && uid && server_key == GameServerData.get_server_key() ) {
                    if (this._redis_handler_map[xy_name]) {
                        this._redis_handler_map[xy_name].call(this, uid, body);
                    }
                }
            }
        } catch (error) {
            Log.error("recv_redis_msg>>",error);
        }
    }

    on_redis_create_room(uid:number, body:any){
        let roomid = body.roomid;
        if(!roomid || roomid == ""){
            Log.error("on_redis_create_room failed!! roomid:" , roomid , "roomdata:", body);
            return;
        }
        let room:Room = roomMgr.get_room_by_roomid(roomid)
        if (room) {
            room.init_data(roomid, body);
        }else{
            room = roomMgr.alloc_room(roomid, body);
        }
    }

    on_redis_back_room(uid: number, body: any) {
        let roomid = body.roomid;
        if (!roomid || roomid == "") {
            Log.error("on_redis_back_room failed!! roomid:", roomid, "roomdata:", body);
            return;
        }
        let room: Room = roomMgr.get_room_by_roomid(roomid)
        if (room) {
            room.init_data(roomid, body);
        } else {
            room = roomMgr.alloc_room(roomid, body);
        }
    }

    on_redis_dessolve_room(uid: number, body: any) {
        let uids = body.uids;
        for (let index = 0; index < uids.length; index++) {
            playerMgr.delete_player(uids[index]);
        }
        RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());
        Log.info("hcc>>on_redis_dessolve_room", body, ",playercoutn:" , playerMgr.get_player_count());

        let roomid = body.roomid;
        roomMgr.delete_room(roomid);
    }
    
    async on_redis_exit_room(uid: number, body: any) {
        playerMgr.delete_player(uid);
        RedisLobby.set_server_playercount(GameServerData.get_server_key(), playerMgr.get_player_count());
        Log.info("hcc>>on_redis_exit_room", body," ,playercount:" , playerMgr.get_player_count());

        let roomid = body.roomid;
        let uids:Array<number> = body.uids;
        if (!roomid || roomid == "" || !uids) {
            // Log.warn("on_redis_back_room failed!! roomid:", roomid, "roomdata:", body);
            return;
        }

        let index = uids.indexOf(uid);
        if(index > 0){
            uids.splice(index,1);
        }
        let room: Room = roomMgr.get_room_by_roomid(roomid)
        if (room) {
            room.init_data(roomid, body);
        }

       GameSendInfo.broadcast_player_info_in_rooom(room, uid);

        let roominfo = await RedisLobby.get_roominfo_by_roomid(roomid);
        if(!roominfo){ //房间已经解散
            roomMgr.delete_room(roomid);
        }
    }

    on_redis_join_room(uid: number, body: any) {
        let roomid = body.roomid;
        let room: Room = roomMgr.get_room_by_roomid(roomid)
        if (room) {
            room.init_data(roomid, body);
        }else{
            room = roomMgr.alloc_room(roomid, body);
        }
    }

    on_redis_user_offline(uid:number, body:any){
        let player:Player = playerMgr.get_player(uid);
        if(player){
            player.set_offline(true);
        }
        let room:Room = roomMgr.get_room_by_roomid(body.roomid);
        if(room){
            SendLogicInfo.broadcast_player_info_in_rooom(room, player.get_uid());
        }
    }

}