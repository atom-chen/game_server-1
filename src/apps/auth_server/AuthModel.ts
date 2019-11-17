import NetBus from '../../netbus/NetBus';
import {Cmd,CmdName} from "../protocol/AuthProto"
import ProtoManater from "../../netbus/ProtoManager"
import { Stype , StypeName } from '../protocol/Stype';
import MySqlAuth from '../../database/MySqlAuth';
import Response from '../Response';
import StringUtil from '../../utils/StringUtil';

var Log =  require("../../utils/Log")

class AuthModel {
    private static readonly Instance: AuthModel = new AuthModel();

    private constructor(){

    }

    public static getInstance(){
        return AuthModel.Instance;
    }

    public recv_cmd_msg(session:any, stype:number, ctype:number, utag:number, proto_type:number, raw_cmd:Buffer){
        Log.info("recv_cmd_msg: ",stype,ctype,utag,proto_type,this.decode_cmd(proto_type,raw_cmd))
        
        switch(ctype){
            case Cmd.eUnameLoginReq:
                this.uname_login(session,utag,proto_type,raw_cmd)
                break;
            case Cmd.eGuestLoginReq:
                this.guest_login(session,utag,proto_type,raw_cmd);
            break;
            case Cmd.eUnameRegistReq:
                this.uname_regist(session,utag,proto_type,raw_cmd)
            break;
            case Cmd.ePhoneRegistReq:
            break;
            case Cmd.eGetPhoneRegVerNumReq:
            break;
            case Cmd.eBindPhoneNumberReq:
            break;
            case Cmd.eResetUserPwdReq:
            break;
            case Cmd.eLoginOutReq:
                this.on_login_out(session, utag, proto_type,raw_cmd)
            break;
            case Cmd.eEditProfileReq:
            break;
            case Cmd.eAccountUpgradeReq:
            break;
            case Cmd.eGetUserCenterInfoReq:
                this.get_user_center_info(session,utag,proto_type,raw_cmd);
            break;
            case Cmd.eReloginRes:
            break;
            case Cmd.eUserLostConnectRes:
                this.on_user_lost_connect(session,utag,proto_type,raw_cmd)
            break;
            default:
            break;
        }
    }

    public recv_cmd_disconnect(session:any){
        
    }

    private decode_cmd(proto_type:number,raw_cmd:any){
        return ProtoManater.decode_cmd(proto_type,raw_cmd);
    }
    
    uname_login(session:any, utag:number, proto_type:number, raw_cmd:any){
        let body =  this.decode_cmd(proto_type,raw_cmd);
        if(!body){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }
        Log.info("uname_login cmd: " , body)

        if(!body.uname || !body.upwd){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }

        if(body.uname.length < 6 || body.upwd.length < 6){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }

        MySqlAuth.login_by_uname_upwd(body.uname , body.upwd , function(status:number , data:any) {
            Log.info("login_by_uname_upwd ret: " , data)
            if(status == Response.OK){
                if(data.length <= 0){
                    NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, {status: Response.UNAME_OR_UPWD_ERR})    
                }else{
                    let sql_info = data[0]
                    let resbody = {
                        status: 1,
                        uid: sql_info.uid,
                        userLoginInfo: JSON.stringify(sql_info)
                    }
                    Log.info("hcc>>uname_login",JSON.stringify(sql_info))
                    NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, resbody)
                }
            }else{
                NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameLoginRes, utag, proto_type, {status: Response.UNAME_OR_UPWD_ERR})    
            }
        })
    }
    
    guest_login(session:any, utag:number, proto_type:number, raw_cmd:any){
        let body =  this.decode_cmd(proto_type,raw_cmd);
        if(!body){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }
        Log.info("guest_login cmd: " , body)
        if(!body.guestkey){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }
        if(body.guestkey.length < 32){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }
        let _this = this;
        MySqlAuth.login_by_guestkey(body.guestkey, function(status:number , data:any) {
            Log.info("login_by_guestkey ret: " , data)
            if(status == Response.OK){
                if(data.length <= 0){ //
                    var unick = "gst" + StringUtil.random_int_str(5);
                    var usex = StringUtil.random_int(0, 1);
                    var uface = StringUtil.random_int(1, 9);
                    MySqlAuth.insert_guest_user(unick, uface, usex, body.guestkey,function (status:number, data:any) {
                        if(status != Response.OK){
                            NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, {status: Response.INVALID_PARAMS})
                            return;
                        }
                        _this.guest_login(session,utag,proto_type,raw_cmd);
                    })
                }else{
                    let sql_info = data[0]
                    let resbody = {
                        status: 1,
                        uid: sql_info.uid,
                        userLoginInfo: JSON.stringify(sql_info)
                    }
                    Log.info("hcc>>login_by_guestkey: ",resbody)
                    NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, resbody)
                }
            }else{
                NetBus.send_cmd(session, Stype.Auth, Cmd.eGuestLoginRes, utag, proto_type, {status: Response.UNAME_OR_UPWD_ERR})    
            }
        })
    }

    uname_regist(session:any, utag:number, proto_type:number, raw_cmd:any){
        let body =  this.decode_cmd(proto_type,raw_cmd);
        Log.info("uname_regist cmd: " , body)

        if(!body){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }

        if(!body.uname || !body.upwdmd5){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }

        if(body.uname.length < 6 || body.upwdmd5.length < 6){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type, {status: Response.INVALID_PARAMS})
            return;
        }

        let unick   = "gst" + StringUtil.random_int_str(5);
        var usex    = StringUtil.random_int(0, 1);
        var uface   = StringUtil.random_int(1, 9);
        MySqlAuth.check_uname_exist(body.uname , function(status:number, data:any) {
            if(status == Response.OK){
                NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type, {status: Response.ILLEGAL_ACCOUNT})
                return;
            }
            MySqlAuth.insert_uname_upwd_user(body.uname, body.upwdmd5, unick, uface, usex, function(status:number, data:any) {
                if(status == Response.OK){
                    NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type,{status: 1})
                }else{
                    NetBus.send_cmd(session, Stype.Auth, Cmd.eUnameRegistRes, utag, proto_type, {status: Response.ILLEGAL_ACCOUNT})
                }
            })
        })
    }

    get_user_center_info(session:any, utag:number, proto_type:number, raw_cmd:any){
        if(utag == 0){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eGetUserCenterInfoRes,utag,proto_type,{status: Response.ILLEGAL_ACCOUNT})
        }

        MySqlAuth.get_uinfo_by_uid(utag,function (status:number, data:any) {
            if(status == Response.OK){
                let sql_info = data[0]
                let resbody = {
                    status: 1,
                    userCenterInfoString: JSON.stringify(sql_info),
                }
                Log.info("get_user_center_info:" , resbody)
                NetBus.send_cmd(session, Stype.Auth, Cmd.eGetUserCenterInfoRes,utag,proto_type,resbody)
            }else{
                NetBus.send_cmd(session, Stype.Auth, Cmd.eGetUserCenterInfoRes,utag,proto_type,{status: Response.ILLEGAL_ACCOUNT})
            }
        })
    }

    on_login_out(session:any, utag:number, proto_type:number,raw_cmd:any){
        Log.info("user login out uid:" , utag)
        if(utag != 0){
            NetBus.send_cmd(session, Stype.Auth, Cmd.eLoginOutRes,utag,proto_type,{status: 1});
        }
    }

    on_user_lost_connect(session:any, utag:number, proto_type:number, raw_cmd:any){
        let body =  this.decode_cmd(proto_type,raw_cmd);
        Log.info("on_user_lost_connect utag:" ,utag , body)
    }
}

export default AuthModel;