import express from 'express'
import validation from '../utils/validation.js';
import authenticationController from '../controller/authenticationController.js'

const router = express();

router.post('/signup', validation.signupVisitor, authenticationController.signupVisitor)
router.post('/login', authenticationController.loginUser)

export default router;