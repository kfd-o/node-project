import express from 'express';
import houseController, { uploadMiddleware } from '../controller/houseController.js';

const router = express.Router();

router.get('/retrieve-house', houseController.getHouses);
router.get('/retrieve-house/:id', houseController.getHouseImages);
router.post('/upload-house', uploadMiddleware, houseController.uploadHouse);

export default router;
