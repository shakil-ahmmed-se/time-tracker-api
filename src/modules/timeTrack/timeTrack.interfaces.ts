import mongoose from "mongoose";
export interface ItimeTrack{
    userId:mongoose.Types.ObjectId,
    projectId?: mongoose.Types.ObjectId,
    start_time?:Date;
    end_time?:Date;
    total_time?:string;
    extra_task?:string;
    created_at?:Date;
}


export type NewtimeTrack = ItimeTrack;

