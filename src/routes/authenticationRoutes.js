import express from 'express'
import validation from '../utils/validation.js'
import authenticationController from '../controller/authenticationController.js'

const router = express();

router.post('/signup', validation.visitorCredentials, authenticationController.signupVisitor);
router.post('/login', authenticationController.loginUser);

export default router;