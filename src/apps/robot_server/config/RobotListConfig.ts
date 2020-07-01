import Platform from "../../../utils/Platform";

export default class RobotListConfig {
    //机器人配置:[房间等级]：机器人uid
    static robot_roomlevel_map: any = {
        [1]: [1917, 1918, 1919, 1920, 1921, 1911, 1912, 1913, 1914, 1932],
        [2]: [1922, 1923, 1924, 1925, 1926],
        [3]: [1927, 1928, 1929, 1930, 1931],
        // [1]: [1911,1912,1913,1914,1932,1934,1935,1936,1937,1938,1939,1940,1941,1942,1943,1944,1945,1946],
    }

    static READY_DELAY_TIME:number = 1500; //准备延迟时间 毫秒
    static SHOOT_DELAY_TIME:number = 2000; //射击延迟时间
    static SHOW_EMOJ_TIME:number = 2000;   //表情发送延迟时间
    static TOTAL_EMOJ_COUNT:number = 35; // 总的表情个数 35个
}

if (Platform.isWin32()){ //测试环境
    RobotListConfig.robot_roomlevel_map = {
        [1]: [1921, 1922, 1923, 1924],
        // [2]: [1925, 1926, 1927],
        // [3]: [1928, 1929, 1930],
        // [1]: [1921,1922],
        // [2]: [1925],
        // [3]: [1923],
    }
}