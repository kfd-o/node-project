import express from 'express'
import userController from '../controller/userController.js';
import validation from '../utils/validation.js';

const router = express();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validation.createUser, userController.createUser);
router.delete('/:id', userController.deleteUserById);

export default router;