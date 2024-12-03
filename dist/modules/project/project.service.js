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
exports.teamprojects = exports.getprojects = exports.createProject = void 0;
const project_model_1 = __importDefault(require("./project.model"));
const createProject = (projectBody) => __awaiter(void 0, void 0, void 0, function* () {
    const project = {
        name: projectBody.name,
        description: projectBody.description,
        color: projectBody.color,
        client_id: projectBody.client_id,
        assign_user: projectBody.assign_user,
        assign_teams: projectBody.assign_teams,
        status: "paused",
        start_Project: new Date(),
        end_project: null,
    };
    return project_model_1.default.create(project);
});
exports.createProject = createProject;
const getprojects = () => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.default.find({ status: { $ne: 'end' } });
    return projects;
});
exports.getprojects = getprojects;
const teamprojects = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.default.find({ assign_teams: id, end_project: null });
    return projects;
});
exports.teamprojects = teamprojects;
//# sourceMappingURL=project.service.js.map