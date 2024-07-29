import express from 'express';
import userController from '../controller/userController.js';
import validation from '../utils/validation.js';

const router = express.Router();


router.get('/protected/:userType', userController.getUserData)
router.get('/fetch-users', userController.getAllUsers)

router.post('/protected/:userType', validation, userController.postUserData)
router.post('/send-otp', userController.sendOtp);
router.post('/verify-otp', userController.verifyOtp);
router.post('/change-password', userController.postChangeUserPassword);

router.delete('/protected/:userType/:id', userController.deleteUserData)

export default router;