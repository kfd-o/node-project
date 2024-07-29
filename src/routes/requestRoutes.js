import requestController from '../controller/requestController.js';
import express from 'express';

const router = express.Router();

router.post('/request-visit/:visitType', requestController.requestVisit);

export default router