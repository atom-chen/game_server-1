export default class State  {
	static UserState = {
		InView: 1,      // 玩家旁观
		Ready: 2,       // 准备好了 
		Playing: 3,     // 正在游戏
		CheckOut: 4,    // 结算状态
		MatchIng: 5,    // 正在匹配
	}

	static GameState = {
		InView: 1,   //还没开始
		Gameing: 2,  //游戏中
		CheckOut: 3, //结算状态
	}

	static PlayerPower = {
		canNotPlay: 0,   	//不能玩
		canPlay: 1, 		//可以玩	
	}
}