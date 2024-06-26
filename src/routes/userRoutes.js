import express from 'express'
import userController from '../controller/userController.js';
import validation from '../utils/validation.js';

const router = express();

router.get('/', userController.getAllUsers);
router.get('/:id', validation.fetchOrDeleteById, userController.getUserById);
router.post('/', validation.createUser, userController.createUser);
router.delete('/:id', validation.fetchOrDeleteById, userController.deleteUserById);

export default router;