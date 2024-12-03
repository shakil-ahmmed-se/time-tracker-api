import jwt, { TokenExpiredError } from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from '../../config/config';
import Token from './token.model';
import ApiError from '../errors/ApiError';
import tokenTypes from './token.types';
import { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces';
import {IUserDoc } from '../user/user.interfaces';
import { userService } from '../user';
import { logger } from '../logger';

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export const generateToken = (
  id: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  secret: string = config.jwt.secret
): string => {
  const payload = {
    sub: id,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };

  let token=jwt.sign(payload, secret);
  return  token
};

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export const saveToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc> => {

  console.log("Save token payload ",{
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  })
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

export const UpdateToken = async (
  token: string,
  userId: mongoose.Types.ObjectId,
  expires: Moment,
  type: string,
  blacklisted: boolean = false
): Promise<ITokenDoc | null> => {
  const tokenDoc = await Token.findOneAndUpdate(
    { user: userId, type },  // Find a token by user and type
    {
      token,                  // Update the token value
      expires: expires.toDate(),  // Update the expiration
      blacklisted,            // Update blacklisted status
    },
    { new: true, upsert: true }  // `new: true` returns the updated document, `upsert: true` creates a new one if none is found
  );

  return tokenDoc;
};


/**
 * Verify a JWT token and return the corresponding token document.
 * @param {string} token - The JWT token to verify.
 * @param {string} type - The token type (e.g., VERIFY_EMAIL).
 * @returns {Promise<ITokenDoc>} - The token document from the database.
 */
export const verifyToken = async (token: string, type: string): Promise<ITokenDoc> => {
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);
    console.log("=>>>>>>>>>>>Debugging_____________=>=>=>=>=>=>", payload);
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      // Token expired
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired, please request a new verification link.');
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }


  if (typeof payload.sub !== 'string') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid token payload');
  }

  console.log("TokenPayloadType",{    token,
    type,
    user: payload.sub,
    blacklisted: false,})

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  
  console.log("typeof payload sub",tokenDoc)

  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found or blacklisted');
  }

  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export const generateAuthTokens = async (user: IUserDoc): Promise<AccessAndRefreshTokens> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');

  console.log("++++++++++++++UsersData",user)
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  // const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  // const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(accessToken, user.id, accessTokenExpires, tokenTypes.ACCESS);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    }
    // refresh: {
    //   token: refreshToken,
    //   expires: refreshTokenExpires.toDate(),
    // },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NO_CONTENT, '');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
export const generateVerifyEmailToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
export const generateVerifyEmailTokenAndUpdateToken = async (user: IUserDoc): Promise<string> => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
  await UpdateToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};
