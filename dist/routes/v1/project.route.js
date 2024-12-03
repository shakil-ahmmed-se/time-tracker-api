"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = require("../../modules/project");
const validate_1 = require("../../modules/validate");
const router = express_1.default.Router();
router.post('/', (0, validate_1.validate)(project_1.ProjectValidation.createProject), project_1.ProjectController.createProject);
router.get('/', (0, validate_1.validate)(project_1.ProjectValidation.getproject), project_1.ProjectController.getProjects);
router.get('/:id', (0, validate_1.validate)(project_1.ProjectValidation.teamProjects), project_1.ProjectController.teamprojects);
exports.default = router;
//# sourceMappingURL=project.route.js.map