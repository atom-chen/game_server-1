import Log from "../../utils/Log";

//保存gateway session
export default class GameRouteData {
    private static _gateway_session: any = null;
    private static _logic_server_session:any = {};

    static get_gateway_session() {
        return GameRouteData._gateway_session;
    }

    static set_gateway_session(session: any) {
        GameRouteData._gateway_session = session;
    }

    static set_logic_server_session(server_key:number, server_session:any){
        GameRouteData._logic_server_session[server_key] = server_session;
    }

    static get_logic_server_session(server_key: number){
        return GameRouteData._logic_server_session[server_key];
    }

    static delete_logic_server_session(server_key:number){
        if (GameRouteData._logic_server_session[server_key]){
            delete GameRouteData._logic_server_session[server_key];
        }
    }

    static get_all_logic_server_session(){
        return GameRouteData._logic_server_session;
    }
}
