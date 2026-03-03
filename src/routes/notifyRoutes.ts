import { Router } from 'express';
import { send, broadcast } from '../controllers/notificationController';

const router = Router();

// POST /notify/send — Receives triggers to send notifications
router.post('/send', send);

// POST /notify/broadcast — Sends a store-wide alert
router.post('/broadcast', broadcast);

export default router;
