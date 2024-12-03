import { query } from 'express';
import Joi from 'joi';


export const createContact = {
    body: Joi.object({
        first_name : Joi.string(),
        last_name : Joi.string(),
        email : Joi.string(),
        phoneNumber : Joi.string(),
        text : Joi.string()
    }),
};


export const getContact ={
    query: Joi.object().keys({
        first_name : Joi.string(),
        last_name : Joi.string(),
        email : Joi.string(),
        phoneNumber : Joi.string(),
        text : Joi.string(),
        send_message_time  : Joi.date()
    })
}


