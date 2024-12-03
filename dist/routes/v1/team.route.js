"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validate_1 = require("../../modules/validate");
const team_1 = require("../../modules/team");
const router = express_1.default.Router();
router.post('/', (0, validate_1.validate)(team_1.Teamvalidation.createTeam), team_1.TeamController.createteam);
router.get('/', (0, validate_1.validate)(team_1.Teamvalidation.getteam), team_1.TeamController.getTeams);
exports.default = router;
//# sourceMappingURL=team.route.js.map