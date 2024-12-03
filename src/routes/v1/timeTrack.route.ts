import express, { Router } from 'express';
import { validate } from '../../modules/validate';
import { timeTrackController, timeTrackValidation } from '../../modules/timeTrack';


const router: Router = express.Router();
router.post('/', validate(timeTrackValidation.createTimetrack), timeTrackController.createtimeTrack);
router.get('/',validate(timeTrackValidation.gettimeTrack),timeTrackController.getalltimetruck);
router.get('/:userId',validate(timeTrackValidation.getUserWorkHourDayAndMonth),timeTrackController.getUserWorkHourDayAndMonth);
router.get('/todayprogress/:userId',validate(timeTrackValidation.todayprogress),timeTrackController.todayprogress);
router.get('/month/work/hour/graph/data/:userId',validate(timeTrackValidation.monthgraphdata),timeTrackController.monthgraphdata);
router.get('/week/work/hour/graph/data/:userId',validate(timeTrackValidation.weekgraphdata),timeTrackController.weekgraphdata);
export default router;