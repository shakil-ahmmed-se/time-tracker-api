import mongoose,{Model,Document} from "mongoose";


export interface Icontact{
    first_name ? : string;
    last_name ? : string;
    email ? : string;
    phoneNumber ? : string;
    text ? : string;
    send_message_time ? : Date;
}


export type NewContact = Icontact;