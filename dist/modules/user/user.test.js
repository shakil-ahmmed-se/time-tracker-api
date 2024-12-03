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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const supertest_1 = __importDefault(require("supertest"));
const faker_1 = require("@faker-js/faker");
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../../config/config"));
const token_types_1 = __importDefault(require("../token/token.types"));
const tokenService = __importStar(require("../token/token.service"));
const app_1 = __importDefault(require("../../app"));
const setupTestDB_1 = __importDefault(require("../jest/setupTestDB"));
const user_model_1 = __importDefault(require("./user.model"));
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
const userTwo = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.name.findName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: 'user',
    isEmailVerified: false,
};
const admin = {
    _id: new mongoose_1.default.Types.ObjectId(),
    name: faker_1.faker.name.findName(),
    email: faker_1.faker.internet.email().toLowerCase(),
    password,
    role: 'admin',
    isEmailVerified: false,
};
const userOneAccessToken = tokenService.generateToken(userOne._id, accessTokenExpires, token_types_1.default.ACCESS);
const adminAccessToken = tokenService.generateToken(admin._id, accessTokenExpires, token_types_1.default.ACCESS);
const insertUsers = (users) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_model_1.default.insertMany(users.map((user) => (Object.assign(Object.assign({}, user), { password: hashedPassword }))));
});
describe('User routes', () => {
    describe('POST /v1/users', () => {
        let newUser;
        beforeEach(() => {
            newUser = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'password1',
                role: 'user',
            };
        });
        test('should return 201 and successfully create new user if data is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.CREATED);
            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toEqual({
                id: expect.anything(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                isEmailVerified: false,
            });
            const dbUser = yield user_model_1.default.findById(res.body.id);
            expect(dbUser).toBeDefined();
            if (!dbUser)
                return;
            expect(dbUser.password).not.toBe(newUser.password);
            expect(dbUser).toMatchObject({ name: newUser.name, email: newUser.email, role: newUser.role, isEmailVerified: false });
        }));
        test('should be able to create an admin as well', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            newUser.role = 'admin';
            const res = yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.CREATED);
            expect(res.body.role).toBe('admin');
            const dbUser = yield user_model_1.default.findById(res.body.id);
            expect(dbUser).toBeDefined();
            if (!dbUser)
                return;
            expect(dbUser.role).toBe('admin');
        }));
        test('should return 401 error if access token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, supertest_1.default)(app_1.default).post('/v1/users').send(newUser).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 403 error if logged in user is not admin', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.FORBIDDEN);
        }));
        test('should return 400 error if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            newUser.email = 'invalidEmail';
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if email is already used', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin, userOne]);
            newUser.email = userOne.email;
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if password length is less than 8 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            newUser.password = 'passwo1';
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if password does not contain both letters and numbers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            newUser.password = 'password';
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
            newUser.password = '1111111';
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 error if role is neither user nor admin', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            newUser.role = 'invalid';
            yield (0, supertest_1.default)(app_1.default)
                .post('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(newUser)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
    describe('GET /v1/users', () => {
        test('should return 200 and apply the default query options', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(3);
            expect(res.body.results[0]).toEqual({
                id: userOne._id.toHexString(),
                name: userOne.name,
                email: userOne.email,
                role: userOne.role,
                isEmailVerified: userOne.isEmailVerified,
            });
        }));
        test('should return 401 if access token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            yield (0, supertest_1.default)(app_1.default).get('/v1/users').send().expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 403 if a non-admin is trying to access all users', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(http_status_1.default.FORBIDDEN);
        }));
        test('should correctly apply filter on name field', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ name: userOne.name })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 1,
            });
            expect(res.body.results).toHaveLength(1);
            expect(res.body.results[0].id).toBe(userOne._id.toHexString());
        }));
        test('should correctly apply filter on role field', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ role: 'user' })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 2,
            });
            expect(res.body.results).toHaveLength(2);
            expect(res.body.results[0].id).toBe(userOne._id.toHexString());
            expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
        }));
        test('should correctly sort the returned array if descending sort param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ sortBy: 'role:desc' })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(3);
            expect(res.body.results[0].id).toBe(userOne._id.toHexString());
            expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
            expect(res.body.results[2].id).toBe(admin._id.toHexString());
        }));
        test('should correctly sort the returned array if ascending sort param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ sortBy: 'role:asc' })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(3);
            expect(res.body.results[0].id).toBe(admin._id.toHexString());
            expect(res.body.results[1].id).toBe(userOne._id.toHexString());
            expect(res.body.results[2].id).toBe(userTwo._id.toHexString());
        }));
        test('should correctly sort the returned array if multiple sorting criteria are specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ sortBy: 'role:desc,name:asc' })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 10,
                totalPages: 1,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(3);
            const expectedOrder = [userOne, userTwo, admin].sort((a, b) => {
                if (a.role < b.role) {
                    return 1;
                }
                if (a.role > b.role) {
                    return -1;
                }
                return a.name < b.name ? -1 : 1;
            });
            expectedOrder.forEach((user, index) => {
                expect(res.body.results[index].id).toBe(user._id.toHexString());
            });
        }));
        test('should limit returned array if limit param is specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ limit: 2 })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 1,
                limit: 2,
                totalPages: 2,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(2);
            expect(res.body.results[0].id).toBe(userOne._id.toHexString());
            expect(res.body.results[1].id).toBe(userTwo._id.toHexString());
        }));
        test('should return the correct page if page and limit params are specified', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo, admin]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query({ page: 2, limit: 2 })
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).toEqual({
                results: expect.any(Array),
                page: 2,
                limit: 2,
                totalPages: 2,
                totalResults: 3,
            });
            expect(res.body.results).toHaveLength(1);
            expect(res.body.results[0].id).toBe(admin._id.toHexString());
        }));
    });
    describe('GET /v1/users/:userId', () => {
        test('should return 200 and the user object if data is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const res = yield (0, supertest_1.default)(app_1.default)
                .get(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(http_status_1.default.OK);
            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toEqual({
                id: userOne._id.toHexString(),
                email: userOne.email,
                name: userOne.name,
                role: userOne.role,
                isEmailVerified: userOne.isEmailVerified,
            });
        }));
        test('should return 401 error if access token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default).get(`/v1/users/${userOne._id}`).send().expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 403 error if user is trying to get another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo]);
            yield (0, supertest_1.default)(app_1.default)
                .get(`/v1/users/${userTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(http_status_1.default.FORBIDDEN);
        }));
        test('should return 200 and the user object if admin is trying to get another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, admin]);
            yield (0, supertest_1.default)(app_1.default)
                .get(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.OK);
        }));
        test('should return 400 error if userId is not a valid mongo id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            yield (0, supertest_1.default)(app_1.default)
                .get('/v1/users/invalidId')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 404 error if user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            yield (0, supertest_1.default)(app_1.default)
                .get(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    describe('DELETE /v1/users/:userId', () => {
        test('should return 204 if data is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default)
                .delete(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(http_status_1.default.NO_CONTENT);
            const dbUser = yield user_model_1.default.findById(userOne._id);
            expect(dbUser).toBeNull();
        }));
        test('should return 401 error if access token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            yield (0, supertest_1.default)(app_1.default).delete(`/v1/users/${userOne._id}`).send().expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 403 error if user is trying to delete another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo]);
            yield (0, supertest_1.default)(app_1.default)
                .delete(`/v1/users/${userTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send()
                .expect(http_status_1.default.FORBIDDEN);
        }));
        test('should return 204 if admin is trying to delete another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, admin]);
            yield (0, supertest_1.default)(app_1.default)
                .delete(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.NO_CONTENT);
        }));
        test('should return 400 error if userId is not a valid mongo id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            yield (0, supertest_1.default)(app_1.default)
                .delete('/v1/users/invalidId')
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 404 error if user already is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            yield (0, supertest_1.default)(app_1.default)
                .delete(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send()
                .expect(http_status_1.default.NOT_FOUND);
        }));
    });
    describe('PATCH /v1/users/:userId', () => {
        test('should return 200 and successfully update user if data is ok', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = {
                name: faker_1.faker.name.findName(),
                email: faker_1.faker.internet.email().toLowerCase(),
                password: 'newPassword1',
            };
            const res = yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.OK);
            expect(res.body).not.toHaveProperty('password');
            expect(res.body).toEqual({
                id: userOne._id.toHexString(),
                name: updateBody.name,
                email: updateBody.email,
                role: 'user',
                isEmailVerified: false,
            });
            const dbUser = yield user_model_1.default.findById(userOne._id);
            expect(dbUser).toBeDefined();
            if (!dbUser)
                return;
            expect(dbUser.password).not.toBe(updateBody.password);
            expect(dbUser).toMatchObject({ name: updateBody.name, email: updateBody.email, role: 'user' });
        }));
        test('should return 401 error if access token is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = { name: faker_1.faker.name.findName() };
            yield (0, supertest_1.default)(app_1.default).patch(`/v1/users/${userOne._id}`).send(updateBody).expect(http_status_1.default.UNAUTHORIZED);
        }));
        test('should return 403 if user is updating another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo]);
            const updateBody = { name: faker_1.faker.name.findName() };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userTwo._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.FORBIDDEN);
        }));
        test('should return 200 and successfully update user if admin is updating another user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, admin]);
            const updateBody = { name: faker_1.faker.name.findName() };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.OK);
        }));
        test('should return 404 if admin is updating another user that is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            const updateBody = { name: faker_1.faker.name.findName() };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.NOT_FOUND);
        }));
        test('should return 400 error if userId is not a valid mongo id', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([admin]);
            const updateBody = { name: faker_1.faker.name.findName() };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/invalidId`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 if email is invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = { email: 'invalidEmail' };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 if email is already taken', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne, userTwo]);
            const updateBody = { email: userTwo.email };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should not return 400 if email is my email', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = { email: userOne.email };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.OK);
        }));
        test('should return 400 if password length is less than 8 characters', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = { password: 'passwo1' };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
        test('should return 400 if password does not contain both letters and numbers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield insertUsers([userOne]);
            const updateBody = { password: 'password' };
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
            updateBody.password = '11111111';
            yield (0, supertest_1.default)(app_1.default)
                .patch(`/v1/users/${userOne._id}`)
                .set('Authorization', `Bearer ${userOneAccessToken}`)
                .send(updateBody)
                .expect(http_status_1.default.BAD_REQUEST);
        }));
    });
});
//# sourceMappingURL=user.test.js.map