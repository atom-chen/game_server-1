"use strict";
exports.__esModule = true;
var Robot = /** @class */ (function () {
    function Robot() {
        this._pos_array = [];
        this._uinfo = {};
    }
    Robot.prototype.set_uinfo = function (uinfo) {
        this._uinfo = uinfo;
    };
    Robot.prototype.get_uinfo = function () {
        return this._uinfo;
    };
    Robot.prototype.get_numberid = function () {
        return this._uinfo.numberid;
    };
    //玩家登陆账号
    Robot.prototype.get_uname = function () {
        return this._uinfo.uname;
    };
    //玩家昵称
    Robot.prototype.get_unick = function () {
        return this._uinfo.unick;
    };
    //座位号ID
    Robot.prototype.get_seatid = function () {
        return this._uinfo.seatid;
    };
    //玩家uid，服务表示ID
    Robot.prototype.get_uid = function () {
        return this._uinfo.uid;
    };
    Robot.prototype.get_offline = function () {
        return this._uinfo.isoffline;
    };
    Robot.prototype.get_is_host = function () {
        return this._uinfo.ishost;
    };
    Robot.prototype.get_user_state = function () {
        return this._uinfo.userstate;
    };
    Robot.prototype.set_pos = function (pos_array) {
        this._pos_array = pos_array;
    };
    Robot.prototype.get_pos = function () {
        return this._pos_array;
    };
    Robot.prototype.reset = function () {
        this._uinfo = {};
    };
    return Robot;
}());
exports["default"] = Robot;
//# sourceMappingURL=Robot.js.map