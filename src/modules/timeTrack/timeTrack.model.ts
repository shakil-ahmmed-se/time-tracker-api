import mongoose,{Schema,Model} from "mongoose";
import { ItimeTrack } from "./timeTrack.interfaces";


const timeTraclSchema = new Schema<ItimeTrack>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: mongoose.Schema.Types.ObjectId,required: false, ref: "Project",default: null,set: (value: any) => (value === "" ? null : value) },
    start_time:{ type: Date, required: false },
    end_time:{ type: Date, required: false },
    total_time:{type: String},
    extra_task:{type: String,required: false,default: null,set: (value: any) => (value === "" ? null : value)},
    created_at:{ type: Date, required: false },
})

const timeTrack: Model<ItimeTrack>= mongoose.model<ItimeTrack>("timeTrack",timeTraclSchema);

export default timeTrack;