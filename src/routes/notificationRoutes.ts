import { Router } from 'express';
import { getNotifications, remove } from '../controllers/notificationController';

const router = Router();

// GET /notifications?userId=xxx — Lists the last 10 notifications for a user
router.get('/', getNotifications);

// DELETE /notifications/:id — Allows a user to clear a notification
router.delete('/:id', remove);

export default router;
