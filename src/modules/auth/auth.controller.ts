import httpStatus from 'http-status';
import { Request, Response } from 'express';
// import moment from 'moment';
import catchAsync from '../utils/catchAsync';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';
import { emailService } from '../email';
import { IUserDoc } from '../user/user.interfaces';
// import config from '../../config/config';
// import { generateToken, saveToken } from '../token/token.service';
// import { logger } from '../logger';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  // await emailService.sendSuccessfulRegistration(user.email, tokens.access.token, user.name||"");
  res.status(httpStatus.CREATED).send({ user, tokens });
  // res.status(httpStatus.CREATED).send(req.body);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

// export const logout = catchAsync(async (req: Request, res: Response) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.token);
  res.status(httpStatus.NO_CONTENT).send();
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
  const userWithTokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...userWithTokens });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});


export const setPassword = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body)
  await authService.setPassword(req.body.email, req.body.password);
  res.status(200).json({ message: 'Password updated successfully' });
});

// export const generateVerifyEmailToken = async (req: Express.Request): Promise<string> => {
//   const user = req.user as IUserDoc; // Cast req.user to IUserDoc

//   if (!user) {
//     throw new Error('User not found in request');
//   }

//   const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
//   const verifyEmailToken = generateToken(user._id, expires, tokenTypes.VERIFY_EMAIL);
//   await saveToken(verifyEmailToken, user._id, expires, tokenTypes.VERIFY_EMAIL);
//   return verifyEmailToken;
// };

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
  // Ensure req.user is defined
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).send('User not authenticated');
  }

  // Cast req.user to IUserDoc
  const user = req.user as IUserDoc; // Assert that req.user is of type IUserDoc

  // Generate verification email token
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);

  // Send verification email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken, user.name||"");

  // Return a successful response
  return res.status(httpStatus.NO_CONTENT).send(); // Ensure there's a return here
});

export const resendVerificationToken = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.params;

  const user = await userService.getUserByEmail(email);
  // Ensure req.user is defined
  if (!user) {
    return res.status(httpStatus.UNAUTHORIZED).send('User not Found !');
  }

  // Cast req.user to IUserDoc
  // const user = req.user as IUserDoc; // Assert that req.user is of type IUserDoc

  // Generate verification email token
  const verifyEmailToken = await tokenService.generateVerifyEmailTokenAndUpdateToken(user);

  // Send verification email
  await emailService.sendVerificationEmail(user.email, verifyEmailToken, user.name||"");

  // // Return a successful response
  return res
    .status(httpStatus.ACCEPTED)
    .send({ status: true, result: 'success', message: 'Your verification token send in your email!' }); // Ensure there's a return here
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const updatedUser=await authService.verifyEmail(req.query.token);
  res.status(httpStatus.ACCEPTED).send({ result: 'success', status: true, message: 'Your account verified successfully !' ,data:updatedUser});
});
