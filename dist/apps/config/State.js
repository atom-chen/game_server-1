"use strict";
exports.__esModule = true;
var State = /** @class */ (function () {
    function State() {
    }
    State.UserState = {
        InView: 1,
        Ready: 2,
        Playing: 3,
        CheckOut: 4,
        MatchIng: 5
    };
    State.GameState = {
        InView: 1,
        Gameing: 2,
        CheckOut: 3
    };
    State.PlayerPower = {
        canNotPlay: 0,
        canPlay: 1
    };
    return State;
}());
exports["default"] = State;
//# sourceMappingURL=State.js.map