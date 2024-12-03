"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.setPassword = exports.resetPassword = exports.forgotPassword = exports.refreshTokens = exports.logout = exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const registerBody = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    // password: Joi.string().required().custom(password), // Required password with custom validation
    password: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    role: joi_1.default.string().valid('user', 'admin').optional(),
    teams: joi_1.default.string().optional(), // Optional teams, defaults to an empty array if not provided
});
exports.register = {
    body: registerBody,
};
exports.login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
// export const logout = {
//   body: Joi.object().keys({
//     refreshToken: Joi.string().required(),
//   }),
// };
exports.logout = {
    body: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
exports.refreshTokens = {
    body: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.forgotPassword = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
exports.resetPassword = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
    body: joi_1.default.object().keys({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
    }),
};
exports.setPassword = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().required().email(),
        password: joi_1.default.string().required(),
    }),
};
exports.verifyEmail = {
    query: joi_1.default.object().keys({
        token: joi_1.default.string().required(),
    }),
};
//# sourceMappingURL=auth.validation.js.map