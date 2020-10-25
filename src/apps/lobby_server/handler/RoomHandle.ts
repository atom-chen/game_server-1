import Log from "../../../utils/Log";
import GameInfoHandle from "./GameInfoHandle";
import LobbySendMsg from "../LobbySendMsg";
import LobbyProto from "../../protocol/protofile/LobbyProto";
import Response from '../../protocol/Response';
import RedisLobby from '../../../database/RedisLobby';
import ProtoManager from "../../../netengine/ProtoManager";
import RedisEvent from '../../../database/RedisEvent';
import ArrayUtil from '../../../utils/ArrayUtil';
import State from '../../config/State';

export default class RoomHandle {

    private static async get_roominfo_obj_by_uid(utag: number) {
        let roominfo = await RedisLobby.get_roominfo_by_uid(utag);
        let roominfoObj = null;
        if (roominfo) {
            try {
                roominfoObj = JSON.parse(roominfo);
            } catch (error) {
                Log.error("hcc>>ger_roominfo_by_uid", error);
            }
        }
        return roominfoObj;
    }

    private static check_gamerule(gamerule_str:string):boolean{
        if (!gamerule_str || gamerule_str == ""){
            return false;
        }
        let gamerule_obj = null;
        try {
            gamerule_obj = JSON.parse(gamerule_str);
        } catch (error) {
            Log.error("check_game_rule:" , error);
            return false;
        }
        if(!gamerule_obj){
            return false;
        }

        let playCount = gamerule_obj.playCount; //局数
        let playerCount = gamerule_obj.playerCount; //人数
        if(!playCount || !playerCount){
            return false;
        }
        return true;
    }

    private static get_gameinfo_obj(gameinfo_str:string){
        if (!gameinfo_str) {
            return null;
        }
        let gameinfo_obj = null;
        try {
            gameinfo_obj = JSON.parse(gameinfo_str);
        } catch (error) {
            Log.error("get_gameinfo_obj",error);
        }

        return gameinfo_obj;
    }

    private static get_gamerule_obj(gamerule_str:string){
        if(!gamerule_str){
            return null;
        }
        let gamerule_obj = null;
        try {
            gamerule_obj = JSON.parse(gamerule_str);
        } catch (error) {
            Log.error("get_gamerule_obj", error);
        }
        return gamerule_obj;
    }

    public static async do_req_create_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_1 });
            return
        }

        let isExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (isExist) {//玩家已经在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }

        //生成房间ID
        let roomid = await RedisLobby.generate_roomid();
        if (!roomid) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }

        let decode_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (!decode_body) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_4 });
            return;
        }

        let game_server_key = await RedisLobby.choose_game_server();
        if (!game_server_key || game_server_key < 0){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_5 });
            Log.error("game_server is full of players!!");
            return;
        }

        let gamerule = decode_body.gamerule;
        let rulecheck = RoomHandle.check_gamerule(gamerule);
        if(!rulecheck){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_6 });
            return;
        }

        let roominfo_obj = {
            roomid: roomid,
            uids: [utag],
            game_serverid: game_server_key,
            game_state: State.GameState.InView,
            gamerule: gamerule,
        }

        Log.info("hcc>>createroominfo: ", roominfo_obj)

        let room_info_json = "";
        try {
            room_info_json = JSON.stringify(roominfo_obj);
        } catch (error) {
            Log.error(error);
            return;
        }

        if (!room_info_json || room_info_json == "") {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.ERROR_7 });
            return;
        }

        let ret = await RedisLobby.save_uid_roominfo_inredis(utag, room_info_json);
        if (ret) {
            let ret2 = await RedisLobby.save_roomid_roominfo_inredis(roomid, room_info_json);
            if (ret2) {
                LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SUCCESS });
                let msg = {
                    xy_name: RedisEvent.redis_lobby_channel_msg.create_room,
                    uid: utag,
                }
                let body = ArrayUtil.ObjCat(msg, roominfo_obj)
                RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel ,JSON.stringify(body));
            }
        }
    }

    public static async do_req_join_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_1 });
            return
        }

        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        let roomid = body.roomid;
        if (!roomid || roomid == "") {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }

        let roominfo_str = await RedisLobby.get_roominfo_by_roomid(roomid);
        if (!roominfo_str) {//房间不存在
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (uidIsExist) {//玩家已经在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_4 });
            return;
        }

       let roominfo_obj = RoomHandle.get_gameinfo_obj(roominfo_str);
       if(!roominfo_obj){
           LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_5 });
            return;
       }

        let game_state = roominfo_obj.game_state;
        if (!game_state || (game_state &&( game_state == State.GameState.Gameing || game_state == State.GameState.CheckOut))){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_6 });
            return;
        }

        let gamerule_obj = RoomHandle.get_gamerule_obj(roominfo_obj.gamerule);
        if (!gamerule_obj) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_7 });
            return;
        }

        let uids:Array<number> = roominfo_obj.uids;
        let maxplayer = gamerule_obj.playerCount;

        if(!uids || !maxplayer){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_8 });
            return;
        }

        if (uids.length >= maxplayer){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.ERROR_9 });
            return;
        }

        let ret = await RedisLobby.add_uid_in_roominfo(roomid, utag);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SUCCESS });
            let roominfo_obj_ex = await RoomHandle.get_roominfo_obj_by_uid(utag);
            if (roominfo_obj_ex){
                let msg = {
                    xy_name: RedisEvent.redis_lobby_channel_msg.join_room,
                    uid: utag,
                }
                let body = ArrayUtil.ObjCat(msg, roominfo_obj_ex);
                RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
            }
        }
    }

    public static async do_req_exit_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.ERROR_1 });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }

        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if(!roominfo_obj){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }

        let game_state = roominfo_obj.game_state;
        if (!game_state || (game_state && (game_state == State.GameState.Gameing || game_state == State.GameState.CheckOut))) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.ERROR_4 });
            return;
        }

        let roomid = roominfo_obj.roomid || "";
        let game_serverid = roominfo_obj.game_serverid || 0;

        let ret = await RedisLobby.delete_uid_in_roominfo(roomid, utag); //房间如果没人，就删掉
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.SUCCESS });

            let roominfo_str = await RedisLobby.get_roominfo_by_roomid(roomid);
            if (roominfo_str){
                // 没解散
                if (game_serverid) {
                    let msg = {
                        xy_name: RedisEvent.redis_lobby_channel_msg.exit_room,
                        uid: utag,
                    }
                    let roominfo_obj_ex = JSON.parse(roominfo_str);
                    if (roominfo_obj_ex){
                        let body = ArrayUtil.ObjCat(msg, roominfo_obj_ex);
                        RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
                    }
                }
            }else{
                // 已经解散
                if (game_serverid) {
                    let msg = {
                        xy_name: RedisEvent.redis_lobby_channel_msg.exit_room,
                        uid: utag,
                    }
                    roominfo_obj.uids = [];
                    let body = ArrayUtil.ObjCat(msg, roominfo_obj);
                    RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
                }
            }
        }
    }

    public static async do_req_dessolve_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.ERROR_1 });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }

        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if (!roominfo_obj) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }

        let roomid = roominfo_obj.roomid || "";
        let ret = await RedisLobby.delete_room(roomid);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SUCCESS });
            let msg = {
                xy_name: RedisEvent.redis_lobby_channel_msg.dessolve_room,
                uid: utag,
            }
            let body = ArrayUtil.ObjCat(msg, roominfo_obj);
            RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
        }

        //同步其他人，房间解散了
        let uids:Array<number> = roominfo_obj.uids;
        if(uids){
            uids.forEach(tmpUid => {
                if (tmpUid != utag){
                    LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, tmpUid, proto_type, { status: Response.SUCCESS });
                }
            });
        }
    }

    public static async do_req_back_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.ERROR_1 });
            return
        }
        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }
        
        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if (!roominfo_obj) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.ERROR_3 });
            return;
        }

        let msg = {
            xy_name: RedisEvent.redis_lobby_channel_msg.back_room,
            uid: utag,
        }
        let body = ArrayUtil.ObjCat(msg, roominfo_obj);
        RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
        LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.SUCCESS });
    }

    public static async do_req_room_status(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.ERROR_1 });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.ERROR_2 });
            return;
        }
        LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.SUCCESS });
    }

}