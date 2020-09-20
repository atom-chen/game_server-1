import RobotListConfig from "../config/RobotListConfig";
import RobotSend from "../RobotSend";
import AuthProto from '../../protocol/protofile/AuthProto';

class RobotAuthIngerface {
    //登录auth服务
    static robot_login_auth_server(server_session: any) {
        for (let _utag in RobotListConfig.robot_roomlevel_map) {
            let robot_obj = RobotListConfig.robot_roomlevel_map[_utag];
            let utag = Number(_utag);
            let guest_key = robot_obj.guestkey;
            RobotSend.send_auth(server_session, AuthProto.XY_ID.REQ_GUESTLOGIN, utag, { guestkey : guest_key});
        }
    }
}

export default RobotAuthIngerface;