import express from 'express'
import visitorController from '../controller/visitorController.js'
import authorizationMiddleware from '../middleware/authorizationMiddleware.js'

const router = express();

router.get('/', authorizationMiddleware, visitorController.getAllVisitors);
router.get('/:id', visitorController.getVisitorById);
router.delete('/:id', visitorController.deleteVisitorById);

export default router;