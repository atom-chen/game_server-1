//玩家状态
export let UserState: any = {
	InView: 1,      // 玩家旁观
	Ready: 2,       // 准备好了 
	Playing: 3,     // 正在游戏
	CheckOut: 4,    // 结算状态
	MatchIng: 5,    // 正在匹配
};

//游戏状态
export let GameState: any = {
    InView:1,   //还没开始
    Gameing:2,  //游戏中
    CheckOut:3, //结算状态
}

//玩家权限
export let PlayerPower: any = {
	canNotPlay : 0,   	//不能玩
	canPlay : 1, 		//可以玩
}