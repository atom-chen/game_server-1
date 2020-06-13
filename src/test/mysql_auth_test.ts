import MySqlAuth from '../database/MySqlAuth';
import GameAppConfig from '../apps/config/GameAppConfig';
import Log from '../utils/Log';
import * as util from 'util';

var db = GameAppConfig.auth_database;
MySqlAuth.connect(db.host, db.port, db.db_name, db.uname, db.upwd)

// setInterval(function(){
// },2000)

async function test_asnyc() {
    let info: any = MySqlAuth.get_uinfo_by_uname_upwd("test1111", "111111");
    Log.info("1111" , info);
}

test_asnyc();

// MySqlAuth.get_guest_uinfo_by_ukey("2",function(err:any,ret:any){
//     if(err){
//         Log.error("hcc>>err: " , err)
//         return;
//     }
//     Log.info("hcc>>info: " ,ret)
// })

// MySqlAuth.insert_guest_user("test2222",3,1,"testkey123456",function(err:any, ret:any){
//     if(err){
//         Log.error("hcc>>err: " , err)
//         return;
//     }
//     Log.info("hcc>>info: " ,ret)
// })

// MySqlAuth.insert_phone_account_user("test3333",1,1,"13065525252","123456789123456789123456",function(err:any, ret:any){
//     if(err){
//         Log.error(err)
//         return
//     }
//     Log.info("success ret: ",ret)
// })
 