"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Robot_1 = __importDefault(require("../cell/Robot"));
var RobotMgr = /** @class */ (function () {
    function RobotMgr() {
        this._robot_set = {}; //uid->Robot
    }
    RobotMgr.getInstance = function () {
        return RobotMgr.Instance;
    };
    RobotMgr.prototype.add_robot_by_uinfo = function (uinfo) {
        var uid = uinfo.uid;
        if (!uid) {
            return false;
        }
        if (this._robot_set[uid]) {
            this._robot_set[uid].set_uinfo(uinfo);
        }
        else {
            var robot = new Robot_1["default"]();
            robot.set_uinfo(uinfo);
            this._robot_set[uinfo.uid] = robot;
        }
        return true;
    };
    RobotMgr.prototype.delete_robot = function (uid) {
        if (this._robot_set[uid]) {
            delete this._robot_set[uid];
        }
    };
    RobotMgr.prototype.get_robot = function (uid) {
        return this._robot_set[uid];
    };
    //保存自己和对家的位置
    RobotMgr.prototype.set_positions = function (uid, pos_array) {
        var robot = this.get_robot(uid);
        if (robot) {
            robot.set_pos(pos_array);
        }
    };
    RobotMgr.prototype.get_postition = function (uid) {
        var robot = this.get_robot(uid);
        if (robot) {
            return robot.get_pos();
        }
    };
    /*
    value:{
    seatid:1,
    posx:2,
    posy:3;
    }
    */
    RobotMgr.prototype.get_robot_self_pos = function (uid) {
        var robot = this.get_robot(uid);
        var out_pos_info = null;
        if (robot) {
            var pos = robot.get_pos();
            var robot_seatid_1 = robot.get_seatid();
            pos.forEach(function (value) {
                if (value.seatid == robot_seatid_1) {
                    out_pos_info = value;
                }
            });
        }
        return out_pos_info;
    };
    RobotMgr.prototype.get_other_pos = function (uid) {
        var robot = this.get_robot(uid);
        var out_pos_info = null;
        if (robot) {
            var pos = robot.get_pos();
            var robot_seatid_2 = robot.get_seatid();
            pos.forEach(function (value) {
                if (value.seatid != robot_seatid_2) {
                    out_pos_info = value;
                }
            });
        }
        return out_pos_info;
    };
    RobotMgr.Instance = new RobotMgr();
    return RobotMgr;
}());
exports["default"] = RobotMgr;
//# sourceMappingURL=RobotMgr.js.map