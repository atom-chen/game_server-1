import Log from "../../utils/Log";

//保存gateway session
export default class GameRouteSaveSession {
    private static _gateway_session: any = null;
    private static _logic_server_session:Array<number> = [];

    static get_gateway_session() {
        return GameRouteSaveSession._gateway_session;
    }

    static set_gateway_session(session: any) {
        GameRouteSaveSession._gateway_session = session;
    }

    static set_logic_server_session(server_index:number, server_session:any){
        GameRouteSaveSession._logic_server_session[server_index] = server_session;
    }

    static get_logic_server_session(server_index: number){
        return GameRouteSaveSession._logic_server_session[server_index];
    }

    static get_all_logic_server_session(){
        return GameRouteSaveSession._logic_server_session;
    }
}

//test
// GameRouteSaveSession.set_logic_server_session(1, "123")
// GameRouteSaveSession.set_logic_server_session(2, "2222")
// GameRouteSaveSession.set_logic_server_session(3, "3333")
// GameRouteSaveSession.set_logic_server_session(6, "67")
// GameRouteSaveSession.set_logic_server_session(100,"10000")

// let all_serssion = GameRouteSaveSession.get_all_logic_server_session()
// Log.info("all_serssion: ", all_serssion);
