export let protoName: string = "DataBaseProto"

export enum Cmd {
	INVALED = 0,
	eAuthUinfoReq = 1,
	eAuthUinfoRes = 2,
}

export let CmdName: any = {
	[0]: "INVALED",
	[1]: "AuthUinfoReq",
	[2]: "AuthUinfoRes",
}