"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamProjects = exports.getproject = exports.createProject = void 0;
const joi_1 = __importDefault(require("joi"));
const CreateProjectBody = joi_1.default.object({
    name: joi_1.default.string(),
    description: joi_1.default.string(),
    color: joi_1.default.string(),
    client_id: joi_1.default.string(),
    assign_user: joi_1.default.array().items(joi_1.default.string()).optional().allow(null),
    assign_teams: joi_1.default.array().items(joi_1.default.string()).optional().allow(null),
    status: joi_1.default.string(),
    start_Project: joi_1.default.date(),
    end_project: joi_1.default.date().optional().allow(null, ''),
});
exports.createProject = {
    body: CreateProjectBody,
};
exports.getproject = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        description: joi_1.default.string(),
        color: joi_1.default.string(),
        client_id: joi_1.default.string(),
        assign_user: joi_1.default.array().items(joi_1.default.string()).optional().allow(null),
        assign_teams: joi_1.default.array().items(joi_1.default.string()).optional().allow(null),
        status: joi_1.default.string(),
        start_Project: joi_1.default.date(),
        end_project: joi_1.default.date(),
    }),
};
exports.teamProjects = {
    params: joi_1.default.object().keys({
        id: joi_1.default.string(),
    }),
};
//# sourceMappingURL=project.validation.js.map