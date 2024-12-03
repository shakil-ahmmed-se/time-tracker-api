import mongoose,{Schema,Model} from 'mongoose';
import { Icontact } from './contact.interfaces';


const contactSchema = new Schema<Icontact>({
   first_name : { type : String , required : true},
   last_name : { type : String , required : true},
   email : { type : String , required:true},
   phoneNumber : { type : String , required:true},
   text : { type : String , required:true},
   send_message_time : { type : Date ,required:false},
})

const Contact : Model<Icontact> = mongoose.model<Icontact>('contact',contactSchema);

export default Contact;