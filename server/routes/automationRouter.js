import express from 'express';
import automationController from '../controllers/automationController';
import automationStatusController from '../controllers/automationStatsController';
import authenticateUser from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateUser, automationController.getAutomations);
router.get('/stats', authenticateUser, automationStatusController);
router.get('/downloadReport', authenticateUser, automationController.postReport);
router.get('/fetchReport', authenticateUser, automationController.getReport);
router.get('/:id', authenticateUser, automationController.retryAutomations);

export default router;
