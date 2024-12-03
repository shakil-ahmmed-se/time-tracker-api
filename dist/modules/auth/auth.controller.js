"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resendVerificationToken = exports.sendVerificationEmail = exports.setPassword = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import moment from 'moment';
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const token_1 = require("../token");
const user_1 = require("../user");
const authService = __importStar(require("./auth.service"));
const email_1 = require("../email");
// import config from '../../config/config';
// import { generateToken, saveToken } from '../token/token.service';
// import { logger } from '../logger';
exports.register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userService.registerUser(req.body);
    // const tokens = await tokenService.generateAuthTokens(user);
    // await emailService.sendSuccessfulRegistration(user.email, tokens.access.token, user.name||"");
    res.status(http_status_1.default.CREATED).send({ user });
    // res.status(httpStatus.CREATED).send(req.body);
}));
exports.login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield authService.loginUserWithEmailAndPassword(email, password);
    // const tokens = await tokenService.generateAuthTokens(user);
    res.send({ user });
}));
// export const logout = catchAsync(async (req: Request, res: Response) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// });
exports.logout = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.logout(req.body.token);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.refreshTokens = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userWithTokens = yield authService.refreshAuth(req.body.refreshToken);
    res.send(Object.assign({}, userWithTokens));
}));
exports.forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resetPasswordToken = yield token_1.tokenService.generateResetPasswordToken(req.body.email);
    yield email_1.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.resetPassword(req.query.token, req.body.password);
    res.status(http_status_1.default.NO_CONTENT).send();
}));
exports.setPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    yield authService.setPassword(req.body.email, req.body.password);
    res.status(200).json({ message: 'Password updated successfully' });
}));
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
exports.sendVerificationEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure req.user is defined
    if (!req.user) {
        return res.status(http_status_1.default.UNAUTHORIZED).send('User not authenticated');
    }
    // Cast req.user to IUserDoc
    const user = req.user; // Assert that req.user is of type IUserDoc
    // Generate verification email token
    const verifyEmailToken = yield token_1.tokenService.generateVerifyEmailToken(user);
    // Send verification email
    yield email_1.emailService.sendVerificationEmail(user.email, verifyEmailToken, user.name || "");
    // Return a successful response
    return res.status(http_status_1.default.NO_CONTENT).send(); // Ensure there's a return here
}));
exports.resendVerificationToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const user = yield user_1.userService.getUserByEmail(email);
    // Ensure req.user is defined
    if (!user) {
        return res.status(http_status_1.default.UNAUTHORIZED).send('User not Found !');
    }
    // Cast req.user to IUserDoc
    // const user = req.user as IUserDoc; // Assert that req.user is of type IUserDoc
    // Generate verification email token
    const verifyEmailToken = yield token_1.tokenService.generateVerifyEmailTokenAndUpdateToken(user);
    // Send verification email
    yield email_1.emailService.sendVerificationEmail(user.email, verifyEmailToken, user.name || "");
    // // Return a successful response
    return res
        .status(http_status_1.default.ACCEPTED)
        .send({ status: true, result: 'success', message: 'Your verification token send in your email!' }); // Ensure there's a return here
}));
exports.verifyEmail = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield authService.verifyEmail(req.query.token);
    res.status(http_status_1.default.ACCEPTED).send({ result: 'success', status: true, message: 'Your account verified successfully !', data: updatedUser });
}));
//# sourceMappingURL=auth.controller.js.map