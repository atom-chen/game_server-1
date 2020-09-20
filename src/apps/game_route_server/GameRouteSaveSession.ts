
//保存gateway session
export default class GameRouteSaveSession {
    private static _gateway_session: any = null;

    static get_gateway_session() {
        return GameRouteSaveSession._gateway_session;
    }

    static set_gateway_session(session: any) {
        GameRouteSaveSession._gateway_session = session;
    }
}