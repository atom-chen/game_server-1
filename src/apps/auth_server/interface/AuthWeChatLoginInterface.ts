import MySqlAuth from "../../../database/MySqlAuth"
import Response from '../../protocol/Response';
import Log from "../../../utils/Log";
import AuthSendMsg from "../AuthSendMsg";
import { Cmd } from "../../protocol/AuthProto";
import ProtoManager from "../../../netbus/ProtoManager";
import * as util from 'util';
import * as https from 'https';
import * as http from "http";
import * as iconv from "iconv-lite";
import WXBizDataCrypt from '../../../utils/WXBizDataCrypt';

let WECHAT_APPID        = "wxb03d15124f396116";
let WECHAT_APPSECRET    = "6b0b8e0066b7e0e9b841a6b9e05b6941";
// let http_wechat_login = "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code";
let HTTPS_WECHAT_LOGIN   = "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code";

class AuthWeChatLoginInterface {

    static do_wechat_login_req(session: any, utag: number, proto_type: number, raw_cmd: any){
        let body = ProtoManager.decode_cmd(proto_type, raw_cmd);
        Log.info("hcc>>do_wechat_login_req:" , body);
        let logincode = body.logincode;
        let wechatuserinfo = body.wechatuserinfo;
        if (wechatuserinfo){
            let userinfoObj     = JSON.parse(wechatuserinfo);
            let encryptedData   = userinfoObj.encryptedData;
            let iv              = userinfoObj.iv;
            let rawData         = userinfoObj.rawData;
            let signature       = userinfoObj.signature;
            let userInfo        = userinfoObj.userInfo;
            let wechat_login_address = util.format(HTTPS_WECHAT_LOGIN, WECHAT_APPID, WECHAT_APPSECRET, logincode);

            Log.info("hcc>>wechat_login_address: ", wechat_login_address);
            // Log.info("hcc>>UserInfo:" , userInfo);
            https.get(wechat_login_address, function (ret: http.IncomingMessage){
                let datas:any = [];
                let size = 0;
                ret.on("data",function(data:any) {
                    datas.push(data);
                    size += data.length;
                    Log.info("hcc>>recv data, size: " , size);
                });

                ret.on("end",function() {
                    Log.info("hcc>>end");
                    let buff = Buffer.concat(datas, size);
                    let result = iconv.decode(buff, "utf8");
                    let d = JSON.parse(result);
                    let wxCrypt = new WXBizDataCrypt(WECHAT_APPID, d.session_key)
                    let res = wxCrypt.decryptData(encryptedData, iv);
                    Log.info("hcc>>real>>res:", res);
                    // res中包含了openId、unionId、nickName、avatarUrl等等信息
                    // 注意，如果你的小游戏没有绑定微信公众号，这里可能也不会有unionId
                    // 微信登录完成，可以开始进入游戏了
                });

                ret.on("error", function (data: any) {
                    Log.error("hcc>>error:", data);
                });
            })             
        }
    }
}

/*
hcc>>real>>res: {
    openId: 'oH8dH45oVZTuPNK6hQaSeANR-F9Y',
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