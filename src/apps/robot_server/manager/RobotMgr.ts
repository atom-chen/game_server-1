import Robot from '../cell/Robot';

class RobotMgr {
    private static readonly Instance: RobotMgr = new RobotMgr();

    _robot_set:any = {}; //uid->Robot

    public static getInstance() {
        return RobotMgr.Instance;
    }

    add_robot_by_uinfo(uinfo: any): boolean {
        let uid = uinfo.uid;
        if (!uid) {
            return false;
        }
        if (this._robot_set[uid]) {
            this._robot_set[uid].set_uinfo(uinfo);
        } else {
            let robot:Robot = new Robot();
            robot.set_uinfo(uinfo);
            this._robot_set[uinfo.uid] = robot;
        }
        return true;
    }

    delete_robot(uid:number){
        if(this._robot_set[uid]){
            delete this._robot_set[uid];
        }
    }

    get_robot(uid:number){
        return this._robot_set[uid];
    }

    //保存自己和对家的位置
    set_positions(uid: number, pos_array: Array<any>){
        let robot:Robot = this.get_robot(uid)
        if(robot){
            robot.set_pos(pos_array);
        }
    }

    get_postition(uid:number){
        let robot: Robot = this.get_robot(uid)
        if (robot) {
            return robot.get_pos();
        }
    }

    /*
    value:{
    seatid:1,
    posx:2,
    posy:3;
    }
    */
    get_robot_self_pos(uid:number){
        let robot: Robot = this.get_robot(uid)
        let out_pos_info = null;
        if (robot) {
            let pos: Array<any> = robot.get_pos();
            let robot_seatid:number = robot.get_seatid();
            pos.forEach(value => {
                if(value.seatid == robot_seatid){
                    out_pos_info = value;
                }
            });
        }
        return out_pos_info;
    }

    get_other_pos(uid:number){
        let robot: Robot = this.get_robot(uid)
        let out_pos_info = null;
        if (robot) {
            let pos:Array<any> = robot.get_pos();
            let robot_seatid:number = robot.get_seatid();
            pos.forEach(value => {
                if (value.seatid != robot_seatid) {
                    out_pos_info = value;
                }
            });
        }
        return out_pos_info;
    }

}

export default RobotMgr;