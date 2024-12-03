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
/* eslint-disable jest/no-commented-out-tests */
const faker_1 = require("@faker-js/faker");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const http_status_1 = __importDefault(require("http-status"));
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const moment_1 = __importDefault(require("moment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const globals_1 = require("@jest/globals");
const app_1 = __importDefault(require("../../app"));
const setupTestDB_1 = __importDefault(require("../jest/setupTestDB"));
const user_model_1 = __importDefault(require("../user/user.model"));
const config_1 = __importDefault(require("../../config/config"));
const tokenService = __importStar(require("../token/token.service"));
const token_types_1 = __importDefault(require("../token/token.types"));
const token_model_1 = __importDefault(require("../token/token.model"));
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
(0, setupTestDB_1.default)();
const password = 'password1';
const salt = bcryptjs_1.default.genSaltSync(8);
const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
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
const insertUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.insertMany(users.map((user) => (Object.assign(Object.assign({}, user), { password: hashedPassword }))));
});
describe('Auth routes', () => {
    describe('POST /v1/auth/register', () => {
        let newUser;
        beforeEach(() => {
            newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1',
            };
        });
        test('should return 201 and successfully register user if request data is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.CREATED);
            expect(res.body.user).not.toHaveProperty('password');
            expect(res.body.user).toEqual({
                id: expect.anything(),
                name: newUser.name,
                email: newUser.email,
                role: 'user',
                isEmailVerified: false,
            });
            const dbUser = yield user_model_1.default.findById(res.body.user.id);
            expect(dbUser).toBeDefined();
            expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email, role: 'user', isEmailVerified: false });
            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() },
            });
        }));
        test('should return 400 error if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.email = 'invalidEmail';
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if email is already used', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            newUser.email = userOne.email;
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if password length is less than 8 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.password = 'passwo1';
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if password does not contain both letters and numbers', () => __awaiter(void 0, void 0, void 0, function* () {
            newUser.password = 'password';
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
            newUser.password = '11111111';
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/register').send(newUser).expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    describe('POST /v1/auth/login', () => {
        test('should return 200 and login user if email and password match', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const loginCredentials = {
                email: userOne.email,
                password: userOne.password,
            };
            const res = yield (0, supertest_1.default)(app_1.default).post('/v1/auth/login').send(loginCredentials).expect(http_status_1.default.OK);
            expect(res.body.user).toEqual({
                id: expect.anything(),
                name: userOne.name,
                email: userOne.email,
                role: userOne.role,
                isEmailVerified: userOne.isEmailVerified,
            });
            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() },
            });
        }));
        test('should return 401 error if there are no users with that email', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginCredentials = {
                email: userOne.email,
                password: userOne.password,
            };
            const res = yield (0, supertest_1.default)(app_1.default).post('/v1/auth/login').send(loginCredentials).expect(http_status_1.default.UNAUTHORIZED);
            expect(res.body).toEqual({ code: http_status_1.default.UNAUTHORIZED, message: 'Incorrect email or password' });
        }));
        test('should return 401 error if password is wrong', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const loginCredentials = {
                email: userOne.email,
                password: 'wrongPassword1',
            };
            const res = yield (0, supertest_1.default)(app_1.default).post('/v1/auth/login').send(loginCredentials).expect(http_status_1.default.UNAUTHORIZED);
            expect(res.body).toEqual({ code: http_status_1.default.UNAUTHORIZED, message: 'Incorrect email or password' });
        }));
    });
    describe('POST /v1/auth/logout', () => {
        test('should return 204 if refresh token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/logout').send({ refreshToken }).expect(http_status_1.default.NO_CONTENT);
            const dbRefreshTokenDoc = yield token_model_1.default.findOne({ token: refreshToken });
            expect(dbRefreshTokenDoc).toBe(null);
        }));
        test('should return 400 error if refresh token is missing from request body', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/logout').send().expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 404 error if refresh token is not found in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/logout').send({ refreshToken }).expect(http_status_1.default.NOT_FOUND);
        }));
        test('should return 404 error if refresh token is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH, true);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/logout').send({ refreshToken }).expect(http_status_1.default.NOT_FOUND);
        }));
    });
    describe('POST /v1/auth/refresh-tokens', () => {
        test('should return 200 and new auth tokens if refresh token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH);
            const res = yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.OK);
            expect(res.body.user).toEqual({
                id: expect.anything(),
                name: userOne.name,
                email: userOne.email,
                role: userOne.role,
                isEmailVerified: userOne.isEmailVerified,
            });
            expect(res.body.tokens).toEqual({
                access: { token: expect.anything(), expires: expect.anything() },
                refresh: { token: expect.anything(), expires: expect.anything() },
            });
            const dbRefreshTokenDoc = yield token_model_1.default.findOne({ token: res.body.tokens.refresh.token });
            expect(dbRefreshTokenDoc).toMatchObject({ type: token_types_1.default.REFRESH, user: userOne._id, blacklisted: false });
            const dbRefreshTokenCount = yield token_model_1.default.countDocuments();
            expect(dbRefreshTokenCount).toBe(1);
        }));
        test('should return 400 error if refresh token is missing from request body', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send().expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 401 error if refresh token is signed using an invalid secret', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH, 'invalidSecret');
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 error if refresh token is not found in the database', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 error if refresh token is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH, true);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 error if refresh token is expired', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().subtract(1, 'minutes');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const expires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
            const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
            yield tokenService.saveToken(refreshToken, userOne._id, expires, token_types_1.default.REFRESH);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/refresh-tokens').send({ refreshToken }).expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
    describe('POST /v1/auth/reset-password', () => {
        test('should return 204 and reset the password', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
            const resetPasswordToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield tokenService.saveToken(resetPasswordToken, userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'password2' })
                .expect(http_status_1.default.NO_CONTENT);
            const dbUser = yield user_model_1.default.findById(userOne._id);
            if (dbUser) {
                const passwordToCompare = dbUser.password; // Get the password
                if (passwordToCompare) {
                    const isPasswordMatch = yield bcryptjs_1.default.compare('password2', passwordToCompare);
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect(isPasswordMatch).toBe(true);
                }
                else {
                    throw new Error('Password is undefined');
                }
            }
            else {
                throw new Error('User not found');
            }
            // const dbResetPasswordTokenCount = await Token.countDocuments({ user: userOne._id, type: tokenTypes.RESET_PASSWORD });
            // expect(dbResetPasswordTokenCount).toBe(0);
        }));
        test('should return 400 if reset password token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/reset-password').send({ password: 'password2' }).expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 401 if reset password token is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
            const resetPasswordToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield tokenService.saveToken(resetPasswordToken, userOne._id, expires, token_types_1.default.RESET_PASSWORD, true);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'password2' })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 if reset password token is expired', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().subtract(1, 'minutes');
            const resetPasswordToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield tokenService.saveToken(resetPasswordToken, userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'password2' })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
            const resetPasswordToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield tokenService.saveToken(resetPasswordToken, userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'password2' })
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 400 if password is missing or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
            const resetPasswordToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield tokenService.saveToken(resetPasswordToken, userOne._id, expires, token_types_1.default.RESET_PASSWORD);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/reset-password').query({ token: resetPasswordToken }).expect(http_status_1.default.BAD_REQUEST);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'short1' })
                .expect(http_status_1.default.BAD_REQUEST);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: 'password' })
                .expect(http_status_1.default.BAD_REQUEST);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/reset-password')
                .query({ token: resetPasswordToken })
                .send({ password: '11111111' })
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    describe('POST /v1/auth/verify-email', () => {
        test('should return 204 and verify the email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
            const verifyEmailToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield tokenService.saveToken(verifyEmailToken, userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/verify-email')
                .query({ token: verifyEmailToken })
                .send()
                .expect(http_status_1.default.NO_CONTENT);
            const dbUser = yield user_model_1.default.findById(userOne._id);
            expect(dbUser).toBeDefined();
            expect(dbUser).toMatchObject({ name: userOne.name, email: userOne.email, role: userOne.role, isEmailVerified: true });
        }));
        test('should return 400 if verify email token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default).post('/v1/auth/verify-email').send().expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 401 if verify email token is blacklisted', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
            const verifyEmailToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield tokenService.saveToken(verifyEmailToken, userOne._id, expires, token_types_1.default.VERIFY_EMAIL, true);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/verify-email')
                .query({ token: verifyEmailToken })
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 if verify email token is expired', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const expires = (0, moment_1.default)().subtract(1, 'minutes');
            const verifyEmailToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield tokenService.saveToken(verifyEmailToken, userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/verify-email')
                .query({ token: verifyEmailToken })
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 401 if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
            const verifyEmailToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield tokenService.saveToken(verifyEmailToken, userOne._id, expires, token_types_1.default.VERIFY_EMAIL);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/auth/verify-email')
                .query({ token: verifyEmailToken })
                .send()
                .expect(http_status_1.default.UNAUTHORIZED);
        }));
    });
});
describe('Auth middleware', () => {
    test('should call next with no errors if access token is valid', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        const user = req.user;
        expect(next).toHaveBeenCalledWith();
        expect(user._id).toEqual(userOne._id);
    }));
    test('should call next with unauthorized error if access token is not found in header', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const req = node_mocks_http_1.default.createRequest();
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with unauthorized error if access token is not a valid jwt token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: 'Bearer randomToken' } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with unauthorized error if the token is not an access token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const expires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
        const refreshToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.REFRESH);
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${refreshToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with unauthorized error if access token is generated with an invalid secret', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const expires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
        const accessToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.ACCESS, 'invalidSecret');
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with unauthorized error if access token is expired', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const expires = (0, moment_1.default)().subtract(1, 'minutes');
        const accessToken = tokenService.generateToken(userOne._id, expires, token_types_1.default.ACCESS);
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${accessToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with unauthorized error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)()(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.UNAUTHORIZED, message: 'Please authenticate' }));
    }));
    test('should call next with forbidden error if user does not have required rights and userId is not in params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const req = node_mocks_http_1.default.createRequest({ headers: { Authorization: `Bearer ${userOneAccessToken}` } });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)('anyRight')(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith(expect.any(ApiError_1.default));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: http_status_1.default.FORBIDDEN, message: 'Forbidden' }));
    }));
    test('should call next with no errors if user does not have required rights but userId is in params', () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUsers([userOne]);
        const req = node_mocks_http_1.default.createRequest({
            headers: { Authorization: `Bearer ${userOneAccessToken}` },
            params: { userId: userOne._id.toHexString() },
        });
        const next = globals_1.jest.fn();
        yield (0, auth_middleware_1.default)('anyRight')(req, node_mocks_http_1.default.createResponse(), next);
        expect(next).toHaveBeenCalledWith();
    }));
});
//# sourceMappingURL=auth.test.js.map