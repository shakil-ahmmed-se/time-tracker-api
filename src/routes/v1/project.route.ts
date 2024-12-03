import express, { Router } from 'express';
import { ProjectController,ProjectValidation } from '../../modules/project';
import { validate } from '../../modules/validate';
const router: Router = express.Router();

router.post('/', validate(ProjectValidation.createProject), ProjectController.createProject);
router.get('/', validate(ProjectValidation.getproject), ProjectController.getProjects);
router.get('/:id', validate(ProjectValidation.teamProjects), ProjectController.teamprojects);

export default router;