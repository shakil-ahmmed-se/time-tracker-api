import mongoose,{Schema,Model} from 'mongoose';
import { Iteam } from './team.interfaces';


const teamSchema = new Schema<Iteam>({
    name: { type: String, required: true },
    description: { type: String },
});

const Team : Model<Iteam> = mongoose.model<Iteam>('Team',teamSchema);
export default Team;