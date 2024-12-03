import express, { Router } from 'express';
import { ContactController ,ContactValidation } from '../../modules/gt_tech_web';
import { validate } from '../../modules/validate';
const router: Router = express.Router();

router.post('/',validate(ContactValidation.createContact),ContactController.createContact);
router.get('/',validate(ContactValidation.getContact),ContactController.getContact);

export default router;