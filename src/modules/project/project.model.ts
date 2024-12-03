import mongoose,{Schema,Model} from 'mongoose';
import { Iproject } from "./project.interfaces";

const projectSchema = new Schema<Iproject>({
    name: { type: String, required: true },
    description: { type: String },
    color: { type: String },
    client_id: { type: String, required: true },
    assign_user: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    assign_teams: { type: [mongoose.Schema.Types.ObjectId], ref: 'Team', default: [] },
    status:{type: String ,default: "paused"},
    start_Project: { type: Date, required: false },
    end_project: { type: Date,default:""},
  });

const Project: Model<Iproject> = mongoose.model<Iproject>('Project', projectSchema);

export default Project;