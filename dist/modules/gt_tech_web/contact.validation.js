"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContact = exports.createContact = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createContact = {
    body: joi_1.default.object({
        first_name: joi_1.default.string(),
        last_name: joi_1.default.string(),
        email: joi_1.default.string(),
        phoneNumber: joi_1.default.string(),
        text: joi_1.default.string()
    }),
};
exports.getContact = {
    query: joi_1.default.object().keys({
        first_name: joi_1.default.string(),
        last_name: joi_1.default.string(),
        email: joi_1.default.string(),
        phoneNumber: joi_1.default.string(),
        text: joi_1.default.string(),
        send_message_time: joi_1.default.date()
    })
};
//# sourceMappingURL=contact.validation.js.map