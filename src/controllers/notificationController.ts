import { Request, Response } from 'express';
import {
  sendNotification,
  getNotificationsByUser,
  deleteNotification,
  broadcastNotification,
} from '../services/notificationService';

export const send = async (req: Request, res: Response) => {
  try {
    const result = await sendNotification(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required' });
      return;
    }
    const notifications = await getNotificationsByUser(userId as string);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to retrieve notifications' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const result = await deleteNotification(req.params.id as string);
    res.status(200).json(result);
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(404).json({ error: 'Notification not found' });
  }
};

export const broadcast = async (req: Request, res: Response) => {
  try {
    const result = await broadcastNotification(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Broadcast error:', error);
    res.status(500).json({ error: 'Failed to broadcast notification' });
  }
};
