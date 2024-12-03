"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const timeTrack_1 = require("../../modules/timeTrack");
const router = express_1.default.Router();
router.post('/', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.createTimetrack), timeTrack_1.timeTrackController.createtimeTrack);
router.get('/', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.gettimeTrack), timeTrack_1.timeTrackController.getalltimetruck);
router.get('/:userId', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.getUserWorkHourDayAndMonth), timeTrack_1.timeTrackController.getUserWorkHourDayAndMonth);
router.get('/todayprogress/:userId', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.todayprogress), timeTrack_1.timeTrackController.todayprogress);
router.get('/month/work/hour/graph/data/:userId', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.monthgraphdata), timeTrack_1.timeTrackController.monthgraphdata);
router.get('/week/work/hour/graph/data/:userId', (0, validate_1.validate)(timeTrack_1.timeTrackValidation.weekgraphdata), timeTrack_1.timeTrackController.weekgraphdata);
exports.default = router;
//# sourceMappingURL=timeTrack.route.js.map