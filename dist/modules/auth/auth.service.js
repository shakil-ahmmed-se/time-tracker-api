"use strict";
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
exports.verifyEmail = exports.setPassword = exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const token_model_1 = __importDefault(require("../token/token.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_types_1 = __importDefault(require("../token/token.types"));
const user_service_1 = require("../user/user.service");
const token_service_1 = require("../token/token.service");
// import { User } from '../user';
// import { logger } from '../logger';
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
const loginUserWithEmailAndPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUserByEmail)(email);
        console.log('Login Users', user);
        if (!(user === null || user === void 0 ? void 0 : user.is_verified)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
        }
        console.log("Check password match", yield user.isPasswordMatch(password));
        if (!user || !(yield user.isPasswordMatch(password))) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
        }
        return user;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, `Something went wrong !, ${error}`);
    }
});
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
// export const logout = async (refreshToken: string): Promise<void> => {
//   const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
//   if (!refreshTokenDoc) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
//   }
//   await refreshTokenDoc.deleteOne();
// };
const logout = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_model_1.default.findOne({ token: token, type: token_types_1.default.ACCESS, blacklisted: false });
    if (!tokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    yield tokenDoc.deleteOne();
});
exports.logout = logout;
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IUserWithTokens>}
 */
const refreshAuth = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTokenDoc = yield (0, token_service_1.verifyToken)(refreshToken, token_types_1.default.REFRESH);
        const user = yield (0, user_service_1.getUserById)(new mongoose_1.default.Types.ObjectId(refreshTokenDoc.user));
        if (!user) {
            throw new Error();
        }
        yield refreshTokenDoc.deleteOne();
        const tokens = yield (0, token_service_1.generateAuthTokens)(user);
        return { user, tokens };
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
});
exports.refreshAuth = refreshAuth;
/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = (resetPasswordToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resetPasswordTokenDoc = yield (0, token_service_1.verifyToken)(resetPasswordToken, token_types_1.default.RESET_PASSWORD);
        const user = yield (0, user_service_1.getUserById)(new mongoose_1.default.Types.ObjectId(resetPasswordTokenDoc.user));
        if (!user) {
            throw new Error();
        }
        yield (0, user_service_1.updateUserById)(user.id, { password: newPassword });
        yield token_model_1.default.deleteMany({ user: user.id, type: token_types_1.default.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
});
exports.resetPassword = resetPassword;
const setPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getUserByEmail)(email);
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found');
        }
        if (!user.is_password_set) {
            yield (0, user_service_1.updateUserById)(user.id, { password: newPassword, is_password_set: true });
            yield token_model_1.default.deleteMany({ user: user.id });
        }
        else {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Password is already set');
        }
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
});
exports.setPassword = setPassword;
/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
const verifyEmail = (verifyEmailToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Token", verifyEmailToken);
        const verifyEmailTokenDoc = yield (0, token_service_1.verifyToken)(verifyEmailToken, token_types_1.default.ACCESS);
        console.log("verifyEmailTokenDocs", verifyEmailTokenDoc);
        const user = yield (0, user_service_1.getUserById)(new mongoose_1.default.Types.ObjectId(verifyEmailTokenDoc.user));
        if (!user) {
            throw new Error();
        }
        // await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
        const updatedUser = yield (0, user_service_1.updateUserById)(user.id, { is_verified: true });
        return updatedUser;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Email verification failed');
    }
});
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=auth.service.js.map