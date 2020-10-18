export default class GameServerData {
    private static _server_key: any = null;

    static get_server_key() {
        return GameServerData._server_key;
    }

    static set_server_key(server_key: any) {
        GameServerData._server_key = server_key;
    }
}
