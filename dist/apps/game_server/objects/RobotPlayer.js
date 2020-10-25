"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Player_1 = __importDefault(require("./Player"));
var RobotPlayer = /** @class */ (function (_super) {
    __extends(RobotPlayer, _super);
    function RobotPlayer(session, uid, proto_type) {
        var _this = _super.call(this, session, uid, proto_type) || this;
        _this._is_robot = true;
        return _this;
    }
    return RobotPlayer;
}(Player_1["default"]));
exports["default"] = RobotPlayer;
//# sourceMappingURL=RobotPlayer.js.map