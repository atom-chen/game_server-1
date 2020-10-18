import RedisEngine from "../utils/RedisEngine";
import Log from "../utils/Log";

//event redis 需要重新开启一个连接
export default class RedisEvent {
    private static redisEngine: RedisEngine = new RedisEngine();

    public static channel_name = {
        lobby_channel : "lobby_channel",
        game_channel: "game_channel",
        auth_channel: "auth_channel",
    }

    public static redis_lobby_msg_name = {
        create_room: "lobby_create_room",
        join_room: "lobby_join_room",
        exit_room: "lobby_exit_room",
        dessolve_room: "lobby_dessolve_room",
        back_room: "lobby_back_room",
    }

    public static redis_game_msg_name = {

    }

    public static redis_auth_msg_name = {

    }

    static engine() {
        return RedisEvent.redisEngine;
    }

    static connect(host?: string, port?: number, db_index?: number) {
        RedisEvent.engine().connect(host, port, db_index);
    }

    static publish_msg(channel:string, message: string) {
        RedisEvent.engine().publish_msg(channel, message);
        Log.info("hcc>>publish_msg:" , channel, message);
    }

    static on_message(channel:string, func: Function) {
        RedisEvent.engine().listen_channel(channel, func);
    }
}