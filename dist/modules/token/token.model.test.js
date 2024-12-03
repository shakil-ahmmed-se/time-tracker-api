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
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const config_1 = __importDefault(require("../../config/config"));
const token_types_1 = __importDefault(require("./token.types"));
const token_model_1 = __importDefault(require("./token.model"));
const tokenService = __importStar(require("./token.service"));
const password = 'password1';
const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
const userOne = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.name.findName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    isEmailVerified: false,
};
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, token_types_1.default.ACCESS);
describe('Token Model', () => {
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
    let newToken;
    beforeEach(() => {
        newToken = {
            token: userOneAccessToken,
            user: userOne._id.toHexString(),
            type: token_types_1.default.REFRESH,
            expires: refreshTokenExpires.toDate(),
        };
    });
    test('should correctly validate a valid token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(new token_model_1.default(newToken).validate()).resolves.toBeUndefined();
    }));
    test('should throw a validation error if type is unknown', () => __awaiter(void 0, void 0, void 0, function* () {
        newToken.type = 'invalidType';
        yield expect(new token_model_1.default(newToken).validate()).rejects.toThrow();
    }));
});
//# sourceMappingURL=token.model.test.js.map