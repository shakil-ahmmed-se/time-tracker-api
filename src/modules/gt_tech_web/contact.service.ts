import { NewContact } from "./contact.interfaces";
import Contact from "./contact.model";

export const createContact = async( contactBody : NewContact ) =>{
    const contact = {
        first_name : contactBody.first_name,
        last_name : contactBody.last_name,
        email : contactBody.email,
        phoneNumber  : contactBody.phoneNumber,
        text : contactBody.text,
        send_message_time : new Date(),
    }

    return Contact.create(contact);
}


export const getContact = async () => {
    const allcontact = await Contact.find();
    return allcontact;
};