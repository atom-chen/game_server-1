import GameAppConfig from '../apps/config/GameAppConfig';
import Log from '../utils/Log';
import MySqlSystem from '../database/MysqlSystem';
import * as util from 'util';

let game_database = GameAppConfig.game_database;
MySqlSystem.connect(game_database.host, game_database.port, game_database.db_name, game_database.uname, game_database.upwd);

export default class testAsyc {

    static async testfunc () {
        // let result = await MySqlSystem.test_func(1918);
        let result = await MySqlSystem.test_func(0);
        Log.info("hcc>>result: ", result);
        Log.info("hcc>>result222");
        // try {
        // } catch ( error) {
        //     Log.error("hcc>>error: " , error);
        // }
    }

}


testAsyc.testfunc();
