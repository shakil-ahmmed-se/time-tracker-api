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
const faker_1 = require("@faker-js/faker");
const user_model_1 = __importDefault(require("./user.model"));
describe('User model', () => {
    describe('User validation', () => {
        let newUser;
        beforeEach(() => {
            newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'user',
            };
        });
        test('should correctly validate a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(new user_model_1.default(newUser).validate()).resolves.toBeUndefined();
        }));
        test('should throw a validation error if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.email = 'invalidEmail';
            yield expect(new user_model_1.default(newUser).validate()).rejects.toThrow();
        }));
        test('should throw a validation error if password length is less than 8 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.password = 'passwo1';
            yield expect(new user_model_1.default(newUser).validate()).rejects.toThrow();
        }));
        test('should throw a validation error if password does not contain numbers', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.password = 'password';
            yield expect(new user_model_1.default(newUser).validate()).rejects.toThrow();
        }));
        test('should throw a validation error if password does not contain letters', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.password = '11111111';
            yield expect(new user_model_1.default(newUser).validate()).rejects.toThrow();
        }));
        test('should throw a validation error if role is unknown', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.role = 'invalid';
            yield expect(new user_model_1.default(newUser).validate()).rejects.toThrow();
        }));
    });
    describe('User toJSON()', () => {
        test('should not return user password when toJSON is called', () => {
            const newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'user',
            };
            expect(new user_model_1.default(newUser).toJSON()).not.toHaveProperty('password');
        });
    });
});
//# sourceMappingURL=user.model.test.js.map