import GameAppConfig from '../apps/config/GameAppConfig';
import Log from '../utils/Log';
import MySqlSystem from '../database/MysqlSystem';
import * as util from 'util';

let game_database = GameAppConfig.game_database;
MySqlSystem.connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);

export default class testAsyc {

    static timeout_fun(){
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                Log.info("timeout_func>>>>>>>>>>>11111");
                resolve("this is timeout func.........")
            }, 3000);
        })
    }

    static async testfunc () {
        // let result = await MySqlSystem.test_func(1918);
        // let result = MySqlSystem.test_func(0);
        // Log.info("hcc>>result: ", result);
        await this.timeout_fun();
        Log.info("hcc>>result222: ");
        // try {
        // } catch ( error) {
        //     Log.error("hcc>>error: " , error);
        // }
        return 0;
    }

}

/*
await 必须和async配对使用

加了await:
await会等待await 执行完成后再执行下面(await必须等待一个Promise,不然不会生效)

不加await:
会先执行await下面的，再执行await

加了async:
函数返回值会变成promise

不加async:
函数返回值不变
*/
let ret = testAsyc.testfunc();
// Log.info("ret33333: " , ret);
