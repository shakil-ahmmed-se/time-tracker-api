import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { TeamController,Teamvalidation } from '../../modules/team';
const router: Router = express.Router();

router.post('/',validate(Teamvalidation.createTeam),TeamController.createteam);
router.get('/',validate(Teamvalidation.getteam),TeamController.getTeams)
export default router;