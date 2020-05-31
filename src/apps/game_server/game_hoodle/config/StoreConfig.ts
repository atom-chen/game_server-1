//商城配置
class StoreConfig {
    private static readonly Instance: StoreConfig = new StoreConfig();

    private _store_list_config:any = [];

    //弹珠等级: 价格
    private _store_price_config = [
        0, 10, 20, 40, 70, 90, 140, 200, 270, 350, 440, //0-10
        540, 650, 770, 900, 1040, 1190, 1350, 1410, 1590, 1780, //11-20
        // 1980, 2190, 2410, 2640, 2880, 3130, 3390, 3660, 3940, 4230, //21-30
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
                propid: 10001,
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
