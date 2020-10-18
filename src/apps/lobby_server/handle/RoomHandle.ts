import Log from "../../../utils/Log";
import GameInfoHandle from "./GameInfoHandle";
import LobbySendMsg from "../LobbySendMsg";
import LobbyProto from "../../protocol/protofile/LobbyProto";
import Response from '../../protocol/Response';
import RedisLobby from '../../../database/RedisLobby';
import ProtoManager from "../../../netbus/ProtoManager";
import RedisEvent from '../../../database/RedisEvent';
import ArrayUtil from '../../../utils/ArrayUtil';

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

    public static async do_req_create_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let isExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (isExist) {//玩家已经在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        //生成房间ID
        let roomid = await RedisLobby.generate_roomid();
        if (!roomid) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let decode_body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        if (!decode_body) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let game_server_key = await RedisLobby.choose_game_server();
        if (!game_server_key || game_server_key < 0){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }
        let roominfo_obj = {
            roomid: roomid,
            uids: [utag],
            game_serverid: game_server_key,
            gamerule: decode_body.gamerule || "",
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
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let ret = await RedisLobby.save_uid_roominfo_inredis(utag, room_info_json);
        if (ret) {
            let ret2 = await RedisLobby.save_roomid_roominfo_inredis(roomid, room_info_json);
            if (ret2) {
                LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.OK });
                let msg = {
                    xy_name: RedisEvent.redis_lobby_msg_name.create_room,
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
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        let roomid = body.roomid;
        if (!roomid || roomid == "") {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let roominfo_str = await RedisLobby.get_roominfo_by_roomid(roomid);
        if (!roominfo_str) {//房间不存在
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (uidIsExist) {//玩家已经在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

       let roominfo_obj = null;
       try {
           roominfo_obj = JSON.parse(roominfo_str);
       } catch (error) {
           Log.error("do_req_join_room>>" , error);
       }

       if(!roominfo_obj){
           LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
       }

       let gamerule_obj = null;
       try {
           gamerule_obj = JSON.parse(roominfo_obj.gamerule);
       } catch (error) {
           Log.error("do_req_join_room22>>", error);
       }

        if (!gamerule_obj) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let uids:Array<number> = roominfo_obj.uids;
        let maxplayer = gamerule_obj.playerCount;

        if(!uids || !maxplayer){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        if (uids.length >= maxplayer){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let ret = await RedisLobby.add_uid_in_roominfo(roomid, utag);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.OK });
            let roominfo_obj_ex = await RoomHandle.get_roominfo_obj_by_uid(utag);
            if (roominfo_obj_ex){
                let msg = {
                    xy_name: RedisEvent.redis_lobby_msg_name.join_room,
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
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if(!roominfo_obj){
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }
        let roomid = roominfo_obj.roomid || "";
        let game_serverid = roominfo_obj.game_serverid || 0;

        let ret = await RedisLobby.delete_uid_in_roominfo(roomid, utag); //房间如果没人，就删掉
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.OK });

            let roominfo_str = await RedisLobby.get_roominfo_by_roomid(roomid);
            if (roominfo_str){
                // 没解散
                if (game_serverid) {
                    let msg = {
                        xy_name: RedisEvent.redis_lobby_msg_name.exit_room,
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
                        xy_name: RedisEvent.redis_lobby_msg_name.exit_room,
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
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if (!roominfo_obj) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let roomid = roominfo_obj.roomid || "";
        let ret = await RedisLobby.delete_room(roomid);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.OK });
            let msg = {
                xy_name: RedisEvent.redis_lobby_msg_name.dessolve_room,
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
                    LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, tmpUid, proto_type, { status: Response.OK });
                }
            });
        }
    }

    public static async do_req_back_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }
        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }
        LobbySendMsg.send(session, LobbyProto.XY_ID.RES_BACKROOM, utag, proto_type, { status: Response.OK });

        let roominfo_obj = await RoomHandle.get_roominfo_obj_by_uid(utag);
        if (roominfo_obj) {
            let msg = {
                xy_name: RedisEvent.redis_lobby_msg_name.back_room,
                uid: utag,
            }
            let body = ArrayUtil.ObjCat(msg, roominfo_obj);
            RedisEvent.publish_msg(RedisEvent.channel_name.lobby_channel, JSON.stringify(body));
        }
    }

    public static async do_req_room_status(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        // Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }
        LobbySendMsg.send(session, LobbyProto.XY_ID.RES_ROOMSTATUS, utag, proto_type, { status: Response.OK });
    }

}