"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gt_tech_web_1 = require("../../modules/gt_tech_web");
const validate_1 = require("../../modules/validate");
const router = express_1.default.Router();
router.post('/', (0, validate_1.validate)(gt_tech_web_1.ContactValidation.createContact), gt_tech_web_1.ContactController.createContact);
router.get('/', (0, validate_1.validate)(gt_tech_web_1.ContactValidation.getContact), gt_tech_web_1.ContactController.getContact);
exports.default = router;
//# sourceMappingURL=contact.route.js.map