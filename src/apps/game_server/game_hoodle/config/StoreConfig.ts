import GameHoodleConfig from "./GameHoodleConfig";

//商城配置
class StoreConfig {
    private static readonly Instance: StoreConfig = new StoreConfig();

    private _store_list_config:any = [];

    //弹珠等级: 价格
    private _store_price_config = [
        0, 10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120, //0-10
        10240, 20480, 40960, 81920, 163840, 327680,
        //  655360, 1310720, 2621440, 5242880,
        // 10485760, 20971520, 41943040, 83886080, 167772160, 335544320, 671088640, 1342177280, 2684354560, 5368709120, //21-30
        // 4530, 4840, 5160, 5490, 5830, 6180, 6540, 6910, 7290, 7680, //31-40
    ];

    public static getInstance() {
        return StoreConfig.Instance;
    }

    constructor(){
        this.cal_store_config();
    }

    cal_store_config(){
        for (let index = 1; index < this._store_price_config.length; index++){
            let configObj = {
                propsvrindex : 10000 + index,
                propid: GameHoodleConfig.KW_PROP_ID_BALL,
                propcount: 1,
                propprice: this._store_price_config[index],
                propinfo : JSON.stringify({ level: index }),
            }
            this._store_list_config.push(configObj);
        }
    }

    public get_store_config(){
        return this._store_list_config;
    }
}

export default StoreConfig;
