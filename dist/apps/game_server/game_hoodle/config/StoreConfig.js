"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var GameHoodleConfig_1 = __importDefault(require("./GameHoodleConfig"));
//商城配置
var StoreConfig = /** @class */ (function () {
    function StoreConfig() {
        this._store_list_config = [];
        //弹珠等级: 价格
        this._store_price_config = [
            0, 200, 400, 1000, 2000, 4000, 7000, 13000, 25000, 48000, 90000,
            150000, 280000, 500000,
        ];
        this.cal_store_config();
    }
    StoreConfig.getInstance = function () {
        return StoreConfig.Instance;
    };
    StoreConfig.prototype.cal_store_config = function () {
        for (var index = 1; index < this._store_price_config.length; index++) {
            var configObj = {
                propsvrindex: 10000 + index,
                propid: GameHoodleConfig_1["default"].KW_PROP_ID_BALL,
                propcount: 1,
                propprice: this._store_price_config[index],
                propinfo: JSON.stringify({ level: index })
            };
            this._store_list_config.push(configObj);
        }
    };
    StoreConfig.prototype.get_store_config = function () {
        return this._store_list_config;
    };
    StoreConfig.Instance = new StoreConfig();
    return StoreConfig;
}());
exports["default"] = StoreConfig;
//# sourceMappingURL=StoreConfig.js.map