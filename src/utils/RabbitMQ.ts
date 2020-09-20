import Log from './Log';
import * as RMQ from "amqplib"
import * as util from 'util';
import GameAppConfig from '../apps/config/GameAppConfig';

let rabbitConnect:any = null;

class RabbitMQ {
    //获取连接
    //default url: "amqp://localhost"
    private static async getConnection(url?: string | RMQ.Options.Connect){
        let tmpurl = util.isNullOrUndefined(url) ? GameAppConfig.rabbit_mq_option : url;
        try {
            if (util.isNullOrUndefined(rabbitConnect)){
                rabbitConnect = await RMQ.connect(tmpurl);
                rabbitConnect.on("error", (err:any) => {
                    rabbitConnect = null //清空失败连接
                    Log.error(`[×] RabbitMQ 异常断线@`);
                });
                rabbitConnect.on("close", () => {
                    rabbitConnect = null //清空失败连接
                    Log.error(`[×] RabbitMQ 异常断线!`);
                    setTimeout(async () => {
                        RabbitMQ.getConnection(tmpurl);
                    }, 1000);
                })
                Log.info(`[√] RabbitMQ 连接成功!`);
            }
            return rabbitConnect;
        } catch (error) {
            Log.error(`[×] RabbitMQ 连接错误!` , error.message);
            setTimeout(async () => {
                RabbitMQ.getConnection(tmpurl);
            }, 1000);
        }
    }

    //获取普通队列，发布者，订阅消费者可用
    private static async getQueue(queue: string, options?: RMQ.Options.AssertQueue) {
        let connction =  await RabbitMQ.getConnection(GameAppConfig.rabbit_mq_option);
        if (util.isNullOrUndefined(connction)){
            return;
        }
        try {
            if (util.isNullOrUndefined(connction.channelQueue)){
                //每次创建一个channen,其实不是很好，万一没释放就会累积
                //所以这里暂时只创建一个channel，达到复用
                connction.channelQueue = await connction.createChannel();
                connction.channelQueue.on("close",function(err:any) {
                    Log.error(`[×] RabbitMQ channel异常断开! close111`);
                    if (connction){
                        connction.channelQueue = null;
                    }
                })
            }
            if (connction.channelQueue){
                await connction.channelQueue.assertQueue(queue, options);//初始化队列
                return connction.channelQueue;
            }
        } catch (error) {
            Log.error(error);                
        }
    }

    //发布消息到队列
   public static async sendMsg(queue: string, msg:Buffer) {
        const channel = await RabbitMQ.getQueue(queue);
        if(channel){
            return await channel.sendToQueue(queue, msg, { persistent: true })
            // await channel.close(); //每次发送完成后关闭channel，不然会造成channel过多
        }
    }

   //订阅队列消费
    public static async recvMsg(queue:string, callback:Function) {
        const channel = await RabbitMQ.getQueue(queue);
        if(channel){
            channel.prefetch(1);
            channel.on("close", async (err:any) => {
                Log.error(`[×] RabbitMQ channel异常断开! close222`);
                setTimeout(async () => { 
                    RabbitMQ.recvMsg(queue, callback);
                }, 1000);
            });
            await channel.consume(queue, (msg: RMQ.ConsumeMessage | null) => {
                if(msg){
                    callback(msg, channel);
                    channel.ack(msg);
                }
            })
        }else{
            setTimeout(async () => {
                RabbitMQ.recvMsg(queue, callback);
            }, 1000);
        }
    }
}

export default RabbitMQ;