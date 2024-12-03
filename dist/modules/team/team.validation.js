"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getteam = exports.createTeam = void 0;
const joi_1 = __importDefault(require("joi"));
const CreateTeamBody = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
});
exports.createTeam = {
    body: CreateTeamBody,
};
exports.getteam = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        description: joi_1.default.string(),
    }),
};
//# sourceMappingURL=team.validation.js.map