import Log from "../../../utils/Log";
import GameInfoHandle from "./GameInfoHandle";
import LobbySendMsg from "../LobbySendMsg";
import LobbyProto from "../../protocol/protofile/LobbyProto";
import Response from '../../protocol/Response';
import RedisLobby from "../../../database/RedisLobby";
import ProtoManager from "../../../netbus/ProtoManager";

export default class RoomHandle {

    public static async do_req_create_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
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

        let room_info_obj = {
            roomid: roomid,
            uids: [utag],
            game_serverid: RedisLobby.choose_game_server(),
            gamerule: decode_body.gamerule || "",
        }

        let room_info_json = "";
        try {
            room_info_json = JSON.stringify(room_info_obj);
        } catch (error) {
            Log.error(error);
            return;
        }

        if (room_info_json == "") {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let ret = await RedisLobby.save_uid_roominfo_inredis(utag, room_info_json);
        if (ret) {
            let ret2 = await RedisLobby.save_roomid_roominfo_inredis(roomid, room_info_json);
            if (ret2) {
                LobbySendMsg.send(session, LobbyProto.XY_ID.RES_CERATEROOM, utag, proto_type, { status: Response.OK });
            }
        }
    }

    public static async do_req_join_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
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

        let roomidIsExist = await RedisLobby.roomid_is_exist(roomid);
        if (!roomidIsExist) { //房间不存在
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (uidIsExist) {//玩家已经在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let ret = await RedisLobby.add_uid_in_roominfo(roomid, utag);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_JOINROOM, utag, proto_type, { status: Response.OK });
        }
    }

    public static async do_req_exit_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.OK });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.OK });
            return;
        }

        let roominfo_json = await RedisLobby.get_roominfo_by_uid(utag);
        let roomid = ""
        try {
            let roominfo_obj = JSON.parse(roominfo_json);
            if (roominfo_obj) {
                roomid = roominfo_obj.roomid;
            }
        } catch (error) {
            Log.error(error);
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.OK });
            return;
        }

        let ret = await RedisLobby.delete_uid_in_roominfo(roomid, utag); //房间如果没人，就删掉
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_EXITROOM, utag, proto_type, { status: Response.OK });
        }
    }

    public static async do_req_dessolve_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
        if (!game_info) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return
        }

        let uidIsExist = await RedisLobby.uid_is_exist_in_room(utag);
        if (!uidIsExist) {//玩家不在房间
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            return;
        }

        let roominfo_json = await RedisLobby.get_roominfo_by_uid(utag);
        let roomid = ""
        try {
            let roominfo_obj = JSON.parse(roominfo_json);
            if (roominfo_obj) {
                roomid = roominfo_obj.roomid;
            }
        } catch (error) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.SYSTEM_ERR });
            Log.error(error);
            return;
        }

        let ret = await RedisLobby.delete_room(roomid);
        if (ret) {
            LobbySendMsg.send(session, LobbyProto.XY_ID.RES_DESSOLVEROOM, utag, proto_type, { status: Response.OK });
        }
    }

    public static async do_req_back_room(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
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
    }

    public static async do_req_room_status(session: any, utag: number, proto_type: number, raw_cmd: any) {
        let game_info = await GameInfoHandle.do_get_ugame_info(utag);
        Log.info("hcc>>game_info", game_info); //玩家信息不存在
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