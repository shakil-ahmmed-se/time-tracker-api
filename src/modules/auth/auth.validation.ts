import Joi from 'joi';
import { password } from '../validate/custom.validation';
import { NewRegisteredUser } from '../user/user.interfaces';

const registerBody = Joi.object({
  email: Joi.string().required().email(),  // Required email
  // password: Joi.string().required().custom(password), // Required password with custom validation
  password: Joi.string().required(), // Required password with custom validation
  name: Joi.string().required(), // Required name
  role: Joi.string().valid('user', 'admin').optional(), // Optional role, can be 'user' or 'admin'
  teams: Joi.string().optional(), // Optional teams, defaults to an empty array if not provided
});

export const register = {
  body: registerBody,
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

// export const logout = {
//   body: Joi.object().keys({
//     refreshToken: Joi.string().required(),
//   }),
// };

export const logout = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};



export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const setPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};
