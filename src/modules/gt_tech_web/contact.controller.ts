import httpStatus from 'http-status';
import { Request, response, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as ContactService from './contact.service';
import { emailService } from '../email';

export const createContact = catchAsync( async ( req : Request , res : Response)=>{
    const contact  = await ContactService.createContact(req.body);
    const {first_name,last_name,email,phoneNumber,text,send_message_time} =contact;
    if(email && first_name && last_name)
    {
        await emailService.sendUserContactSuccessEmail(email,first_name,last_name);
    }
    if (send_message_time && email && first_name && last_name && phoneNumber && text) {
        const date = new Date(send_message_time);
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',   
            day: '2-digit',   
            hour: '2-digit',  
            minute: '2-digit', 
            hour12: true  
        };
        const to = "iotlabtech24@gmail.com";
        const formattedDateTime = date.toLocaleString('en-US', options);
        await emailService.sendUserContactReceivedEmail(to,first_name,last_name,email,phoneNumber,text,formattedDateTime);
    }
    res.send({message : "success"});
});


export const getContact = catchAsync(async(req :Request , res : Response)=>{
    console.log("hello");
    const allcontact = await ContactService.getContact();
    res.status(200).send(allcontact);
}

)
