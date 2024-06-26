import express from 'express'
import visitorController from '../controller/visitorController.js';
import validation from '../utils/validation.js';

const router = express();

router.get('/', visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitorById);
router.post('/', validation.createVisitor, visitorController.createVisitor);
router.delete('/:id', visitorController.deleteVisitorById);

export default router;