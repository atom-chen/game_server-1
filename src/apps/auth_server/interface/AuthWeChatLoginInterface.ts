// 微信小程序登录

import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import ProtoManager from "../../../netengine/ProtoManager";
import * as util from 'util';
import * as https from 'https';
import * as http from "http";
import * as iconv from "iconv-lite";
import WXBizDataCrypt from '../../../utils/WXBizDataCrypt';
import AuthProto from '../../protocol/protofile/AuthProto';

let WECHAT_APPID        = "wxb03d15124f396116";
let WECHAT_APPSECRET    = "6b0b8e0066b7e0e9b841a6b9e05b6941";
let HTTPS_WECHAT_LOGIN   = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

class AuthWeChatLoginInterface {

    static async do_wechat_login_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATLOGIN, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        // Log.info("hcc>>do_wechat_login_req:" , body);
        let logincode = body.logincode;
        let wechatuserinfo = body.userlogininfo;
        if (wechatuserinfo){
            let userinfoObj     = JSON.parse(wechatuserinfo);
            let obj_encryptedData   = userinfoObj.encryptedData;
            let obj_iv              = userinfoObj.iv;
            let obj_rawData         = userinfoObj.rawData;
            let obj_signature       = userinfoObj.signature;
            let obj_userInfo        = userinfoObj.userInfo;
            let wechat_login_address = util.format(HTTPS_WECHAT_LOGIN, WECHAT_APPID, WECHAT_APPSECRET, logincode);

            // Log.info("hcc>>wechat_login_address: ", wechat_login_address);
            // Log.info("hcc>>UserInfo:" , userInfo);
            https.get(wechat_login_address, function (ret: http.IncomingMessage){
                let datas:any = [];
                let size = 0;
                ret.on("data",function(data:any) {
                    datas.push(data);
                    size += data.length;
                    // Log.info("hcc>>recv data, size: " , size);
                });

                // res中包含了openId、unionId、nickName、avatarUrl等等信息
                // 注意，如果你的小游戏没有绑定微信公众号，这里可能也不会有unionId
                // 微信登录完成，可以开始进入游戏了

                ret.on("end", async function() {
                    let buff = Buffer.concat(datas, size);
                    let result = iconv.decode(buff, "utf8");
                    try {
                        let d_result = JSON.parse(result);
                        if (d_result.session_key) {
                            try {
                                let wxCrypt = new WXBizDataCrypt(WECHAT_APPID, d_result.session_key)
                                let decode_data = wxCrypt.decryptData(obj_encryptedData, obj_iv);
                                // Log.info("hcc>>real>>res:", decode_data);
                                await AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data);
                            } catch (error) {
                                Log.error("error1" , error);
                            }
                        }
                    } catch (error) {
                        Log.error("error2", error);
                    }
                });

                ret.on("error", function (data: any) {
                    Log.error("hcc>>error:", data);
                });
            })             
        }
    }

    static async do_login_by_wechat_unionid(session: any, utag: number, proto_type: number, decode_data:any){

        let unionId         = decode_data.unionId;
        let avatarUrl       = decode_data.avatarUrl;
        let nickName        = decode_data.nickName;
        let gender          = decode_data.gender;
        let country         = decode_data.country;
        let province        = decode_data.province;
        let city            = decode_data.city;

        if(!country){
            country = "unknown";
        }

        if (!province) {
            province = "unknown";
        }

        if (!city) {
            city = "unknown";
        }

        if(util.isNullOrUndefined(gender)){
            return;
        }

        if (util.isNullOrUndefined(avatarUrl) || util.isNullOrUndefined(nickName) || util.isNullOrUndefined(unionId)){
            // Log.warn("hcc>>do_login_by_wechat_unionid>>1111");
            return;
        }

        let address = country + "-" + province + "-" + city;
        let data:any = await MySqlAuth.login_by_wechat_unionid(unionId);
        if (data){
            if (data.length <= 0) {
                let insert_ret:any = await MySqlAuth.insert_wechat_user(nickName, gender, address, unionId, avatarUrl);
                if (insert_ret){
                    AuthWeChatLoginInterface.do_login_by_wechat_unionid(session, utag, proto_type, decode_data);
                }
            }else{
                let sql_info = data[0]
                let resbody = {
                    status: Response.SUCCESS,
                    uid: Number(sql_info.uid),
                    userlogininfo: JSON.stringify(sql_info)
                }
                // Log.info("hcc>>do_login_by_wechat_unionid: ", resbody)
                AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATLOGIN, utag, proto_type, resbody)
                //登录成功后，立即更新玩家微信数据，可能会耗费IO，但是为了同步微信信息没办法
                let login_uid = sql_info.uid;
                if(login_uid){
                    let ret = await MySqlAuth.update_wechat_user_info(login_uid, nickName, gender, address, unionId, avatarUrl);
                    if(ret){
                        Log.info("hcc>>wechat login >> update user info success!!");
                    }
                }
                return;
            }
        }
        AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATLOGIN, utag, proto_type, { status: Response.ERROR_1 })
    }

    //微信session登录(其实就是unionid登录)
    static async do_wechat_session_login_req(session: any, utag: number, proto_type: number, raw_cmd: any) {
        if (utag == 0) {
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, { status: Response.ERROR_1 })
            return;
        }
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        // Log.info("hcc>>do_wechat_session_login_req111,body:  " , body);
        if(body){
            let wechatsessionkey = body.wechatsessionkey;
            if (wechatsessionkey) {
                let data:any = await MySqlAuth.login_by_wechat_unionid(wechatsessionkey);
                if(data.length > 0){
                    let sql_info = data[0]
                    let resbody = {
                        status: Response.SUCCESS,
                        uid: Number(sql_info.uid),
                        userlogininfo: JSON.stringify(sql_info)
                    }
                    Log.info("hcc>>do_wechat_session_login_req: ", resbody)
                    AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, resbody)
                    return;
                }
            }
            AuthSendMsg.send(session, AuthProto.XY_ID.RES_WECHATSESSIONLOGIN, utag, proto_type, { status: Response.ERROR_2 })
        }
    }
}

/*
hcc>>real>>res:decode_data: {
    openId: 'oH8dH45oVZTuPNK6hQaSeANR-F9Y',
    unionId: 'oaCkmwOd91uU-3oX78pJ59PFndGs',
    nickName: 'C小C',
    gender: 1,
    language: 'zh_CN',
    city: 'Hangzhou',
    province: 'Zhejiang',
    country: 'China',
    avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLQoDgahGVTFb6H74TZz9z5OI9RoXWmXJ6WXbWsfvWKCAD5KCdaYfdJZCf8aR0N4oP5bKXImelbkw/132',
    watermark: { timestamp: 1588006212, appid: 'wxb03d15124f396116' }
}
*/

export default AuthWeChatLoginInterface;