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
exports.getContact = exports.createContact = void 0;
const contact_model_1 = __importDefault(require("./contact.model"));
const createContact = (contactBody) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = {
        first_name: contactBody.first_name,
        last_name: contactBody.last_name,
        email: contactBody.email,
        phoneNumber: contactBody.phoneNumber,
        text: contactBody.text,
        send_message_time: new Date(),
    };
    return contact_model_1.default.create(contact);
});
exports.createContact = createContact;
const getContact = () => __awaiter(void 0, void 0, void 0, function* () {
    const allcontact = yield contact_model_1.default.find();
    return allcontact;
});
exports.getContact = getContact;
//# sourceMappingURL=contact.service.js.map