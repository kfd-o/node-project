import express from 'express'
import authenticationController from '../controller/authenticationController.js'
import verifyToken from '../middleware/verifyToken.js';

const router = express();

router.post('/login', authenticationController.loginUser);
router.post('/check-token', verifyToken, authenticationController.checkToken);
router.post('/refresh-token', authenticationController.refreshToken);

export default router;