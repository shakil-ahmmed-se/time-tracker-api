"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.getUsers = exports.createUser = void 0;
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("../validate/custom.validation");
const createUserBody = joi_1.default.object({
    email: joi_1.default.string().required().email(),
    password: joi_1.default.string().required().custom(custom_validation_1.password),
    name: joi_1.default.string().required(),
    role: joi_1.default.string().required().valid('user', 'admin'),
    teams: joi_1.default.string().optional().allow(null),
    is_password_set: joi_1.default.boolean().optional().allow(null),
    is_verified: joi_1.default.boolean().optional().allow(null),
    otp: joi_1.default.string().optional().allow(null),
    otp_time: joi_1.default.date().optional().allow(null), // Change as needed
});
exports.createUser = {
    body: createUserBody,
};
exports.getUsers = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        projectBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
// export const getUser = {
//   params: Joi.object().keys({
//     userId: Joi.string().custom(objectId),
//   }),
// };
//get user validation user id
exports.getUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string(),
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
exports.deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
//# sourceMappingURL=user.validation.js.map