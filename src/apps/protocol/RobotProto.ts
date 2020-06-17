export let protoName: string = "RobotProto"

export enum Cmd {
	INVALED = 0,
	eLoginReq = 1,
	eLoginRes = 2,
}

export let CmdName:any = {
	[0] : "INVALED",
	[1] : "LoginReq",
	[2] : "LoginRes",
}