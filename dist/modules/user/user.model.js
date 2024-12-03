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
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const toJSON_1 = __importDefault(require("../toJSON/toJSON"));
const paginate_1 = __importDefault(require("../paginate/paginate"));
const roles_1 = require("../../config/roles");
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        // minlength: 8,
        // validate(value: string) {
        //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //     throw new Error('Password must contain at least one letter and one number');
        //   }
        // },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: roles_1.roles,
        default: 'user',
    },
    is_verified: {
        type: Boolean,
        default: false,
    },
    teams: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Team", default: null },
    is_password_set: {
        type: Boolean,
        default: false,
    },
    // otp: {
    //   type: Number,
    //   default: 0,
    // },
    // otp_time: {
    //   type: Date,
    //   default: Date.now(),
    // },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(toJSON_1.default);
userSchema.plugin(paginate_1.default);
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (!user.password) {
            throw new Error('Password is not set for this user');
        }
        return bcryptjs_1.default.compare(password, user.password);
    });
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password') && user.password) {
            // Ensure password is defined
            user.password = yield bcryptjs_1.default.hash(user.password, 8);
        }
        next();
    });
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map