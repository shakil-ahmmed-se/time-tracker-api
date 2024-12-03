import Joi from 'joi';
import { password, objectId } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password),
  name: Joi.string().required(),
  role: Joi.string().required().valid('user', 'admin'),
  teams: Joi.string().optional().allow(null), // Change as needed
  is_password_set: Joi.boolean().optional().allow(null), // Change as needed
  is_verified: Joi.boolean().optional().allow(null), // Change as needed
  otp: Joi.string().optional().allow(null), // Change as needed
  otp_time: Joi.date().optional().allow(null), // Change as needed
});

export const createUser = {
  body: createUserBody,
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

// export const getUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId),
//   }),
// };

//get user validation user id
export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string(),
  }),
};


// export const updateUser = {
//   params: Joi.object().keys({
//     userId: Joi.required().custom(objectId),
//   }),
//   body: Joi.object()
//     .keys({
//       email: Joi.string().email(),
//       password: Joi.string().custom(password),
//       name: Joi.string(),
//     })
//     .min(1),
// };

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
