export let protoName: string = "AuthProto"

export enum Cmd {
	INVALED = 0,
	eUnameLoginReq = 1, //用户名登陆
	eUnameLoginRes = 2,
	eGuestLoginReq = 3,//游客登陆
	eGuestLoginRes = 4,
	eUnameRegistReq = 5,//用户名注册
	eUnameRegistRes = 6,
	ePhoneRegistReq = 7,//手机注册
	ePhoneRegistRes = 8,
	eGetPhoneRegVerNumReq = 9,//手机验证码
	eGetPhoneRegVerNumRes = 10,
	eBindPhoneNumberReq = 11,//绑定手机号
	eBindPhoneNumberRes = 12,
	eResetUserPwdReq = 13,//重置密码
	eResetUserPwdRes = 14,
	eLoginOutReq = 15,//退出登陆游戏
	eLoginOutRes = 16,
	eEditProfileReq = 17,//修改玩家信息
	eEditProfileRes = 18,
	eAccountUpgradeReq = 19,//账户升级
	eAccountUpgradeRes = 20,
	eGetUserCenterInfoReq = 21,//获取用户信息
	eGetUserCenterInfoRes = 22,
	eReloginRes = 23,//用户被挤号
	eUserLostConnectRes = 24//用户丢失链接
}

export let CmdName = {
	[0] : "INVALED",
	[1] : "UnameLoginReq",
	[2] : "UnameLoginRes",
	[3] : "GuestLoginReq",
	[4] : "GuestLoginRes",
	[5] : "UnameRegistReq",
	[6] : "UnameRegistRes",
	[7] : "PhoneRegistReq",
	[8] : "PhoneRegistRes",
	[9] : "GetPhoneRegVerNumReq",
	[10] : "GetPhoneRegVerNumRes",
	[11] : "BindPhoneNumberReq",
	[12] : "BindPhoneNumberRes",
	[13] : "ResetUserPwdReq",
	[14] : "ResetUserPwdRes",
	[15] : "LoginOutReq",
	[16] : "LoginOutRes",
	[17] : "EditProfileReq",
	[18] : "EditProfileRes",
	[19] : "AccountUpgradeReq",
	[20] : "AccountUpgradeRes",
	[21] : "GetUserCenterInfoReq",
	[22] : "GetUserCenterInfoRes",
	[23] : "ReloginRes",
	[24] : "UserLostConnectRes",
}