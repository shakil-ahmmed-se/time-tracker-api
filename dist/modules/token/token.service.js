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
exports.generateVerifyEmailTokenAndUpdateToken = exports.generateVerifyEmailToken = exports.generateResetPasswordToken = exports.generateAuthTokens = exports.verifyToken = exports.UpdateToken = exports.saveToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config/config"));
const token_model_1 = __importDefault(require("./token.model"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const token_types_1 = __importDefault(require("./token.types"));
const user_1 = require("../user");
/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (id, expires, type, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: id,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    let token = jsonwebtoken_1.default.sign(payload, secret);
    return token;
};
exports.generateToken = generateToken;
/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
const saveToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Save token payload ", {
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    const tokenDoc = yield token_model_1.default.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
});
exports.saveToken = saveToken;
const UpdateToken = (token, userId, expires, type, blacklisted = false) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenDoc = yield token_model_1.default.findOneAndUpdate({ user: userId, type }, // Find a token by user and type
    {
        token,
        expires: expires.toDate(),
        blacklisted, // Update blacklisted status
    }, { new: true, upsert: true } // `new: true` returns the updated document, `upsert: true` creates a new one if none is found
    );
    return tokenDoc;
});
exports.UpdateToken = UpdateToken;
/**
 * Verify a JWT token and return the corresponding token document.
 * @param {string} token - The JWT token to verify.
 * @param {string} type - The token type (e.g., VERIFY_EMAIL).
 * @returns {Promise<ITokenDoc>} - The token document from the database.
 */
const verifyToken = (token, type) => __awaiter(void 0, void 0, void 0, function* () {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
        console.log("=>>>>>>>>>>>Debugging_____________=>=>=>=>=>=>", payload);
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.TokenExpiredError) {
            // Token expired
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token has expired, please request a new verification link.');
        }
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
    }
    if (typeof payload.sub !== 'string') {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid token payload');
    }
    console.log("TokenPayloadType", { token,
        type,
        user: payload.sub,
        blacklisted: false, });
    const tokenDoc = yield token_model_1.default.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false,
    });
    console.log("typeof payload sub", tokenDoc);
    if (!tokenDoc) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Token not found or blacklisted');
    }
    return tokenDoc;
});
exports.verifyToken = verifyToken;
/**
 * Generate auth tokens
 * @param {IUserDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
const generateAuthTokens = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    console.log("++++++++++++++UsersData", user);
    const accessToken = (0, exports.generateToken)(user.id, accessTokenExpires, token_types_1.default.ACCESS);
    // const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    // const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
    yield (0, exports.saveToken)(accessToken, user.id, accessTokenExpires, token_types_1.default.ACCESS);
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
});
exports.generateAuthTokens = generateAuthTokens;
/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.userService.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NO_CONTENT, '');
    }
    const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = (0, exports.generateToken)(user.id, expires, token_types_1.default.RESET_PASSWORD);
    yield (0, exports.saveToken)(resetPasswordToken, user.id, expires, token_types_1.default.RESET_PASSWORD);
    return resetPasswordToken;
});
exports.generateResetPasswordToken = generateResetPasswordToken;
/**
 * Generate verify email token
 * @param {IUserDoc} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = (0, exports.generateToken)(user.id, expires, token_types_1.default.VERIFY_EMAIL);
    yield (0, exports.saveToken)(verifyEmailToken, user.id, expires, token_types_1.default.VERIFY_EMAIL);
    return verifyEmailToken;
});
exports.generateVerifyEmailToken = generateVerifyEmailToken;
const generateVerifyEmailTokenAndUpdateToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = (0, exports.generateToken)(user.id, expires, token_types_1.default.VERIFY_EMAIL);
    yield (0, exports.UpdateToken)(verifyEmailToken, user.id, expires, token_types_1.default.VERIFY_EMAIL);
    return verifyEmailToken;
});
exports.generateVerifyEmailTokenAndUpdateToken = generateVerifyEmailTokenAndUpdateToken;
//# sourceMappingURL=token.service.js.map