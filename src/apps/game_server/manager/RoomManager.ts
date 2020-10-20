import Room from '../cell/Room';
import ArrayUtil from '../../../utils/ArrayUtil';
import Log from '../../../utils/Log';
import GameHoodleConfig from '../config/GameHoodleConfig';
import Response from '../../protocol/Response';
import GameHoodleProto from '../../protocol/protofile/GameHoodleProto';
import RedisLobby from '../../../database/RedisLobby';

class RoomManager {
    private static readonly Instance: RoomManager = new RoomManager();

    private _room_set:any = {} //roomid-->room

    private constructor(){
        //删除创建超过10分钟的房间
        let _this = this;
        setInterval(function() {
            /*
            for(let idx in _this._room_set){
                let room:Room = _this._room_set[idx];
                room.set_tick_count(room.get_tick_count() + 1);
                let tick_count = room.get_tick_count();
                // Log.info("tick count: roomid: " , room.get_room_id() , " count: ", tick_count);
                if( tick_count >= GameHoodleConfig.ROOM_MAX_DISMISS_TIME){
                    room.broadcast_in_room(GameHoodleProto.XY_ID.eDessolveRes, { status: Response.OK });
                    _this.delete_room(room.get_room_id());
                }
            }
        */
        },1000);
    }

    public static getInstance(){
        return RoomManager.Instance;
    }

    alloc_room(roomid:string, roomdata:any){
        let room = new Room(roomid, roomdata);
        this._room_set[roomid] = room;
        Log.info("creat room success roomid: " , roomid , " ,roomCount: " , this.get_room_count())
        return room;
    }

    //用roomid获取房间
    get_room_by_roomid(roomid:string){
        if(this._room_set[roomid]){
            return this._room_set[roomid];
        }
        return null;
    }

    delete_room(roomid:string){
        if(this._room_set[roomid]){
            delete this._room_set[roomid];
            Log.info("delete_room:", roomid, "success, roomCount: " , this.get_room_count());
            RedisLobby.delete_room(roomid);
            return true;
        }else{
            Log.warn("delete_room:", roomid, "is not in game server!!!!");
            return false;
        }
    }

    get_room_count(){
        return ArrayUtil.GetArrayLen(this._room_set);
    }

    get_all_room(){
        return this._room_set;
    }
}

export default RoomManager;