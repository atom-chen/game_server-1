import TimeUtil from '../utils/TimeUtil';

let daystr:any = TimeUtil.timestamp();
console.log("timestamp: " , daystr);
daystr = TimeUtil.timestamp_today();
console.log("timestamp_today: ", daystr);
daystr = TimeUtil.timestamp_yesterday();
console.log("timestamp_yesterday: ", daystr);
daystr = TimeUtil.get_cur_time();
console.log("get_cur_time: ", daystr);

