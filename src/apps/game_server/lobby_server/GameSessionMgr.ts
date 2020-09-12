
class GameSessionMgr {
    private static _gateway_session: any = null;

    static get_gateway_session(){
        return GameSessionMgr._gateway_session;
    }

    static set_gateway_session(session:any){
        GameSessionMgr._gateway_session = session;
    }

}

export default GameSessionMgr;