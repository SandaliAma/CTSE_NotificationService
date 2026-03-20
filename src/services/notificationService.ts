import mongoose from 'mongoose';
import { getUserById } from '../clients/userServiceClient';
import Notification from '../models/notificationModel';
import { SendNotificationPayload, BroadcastPayload } from '../types';
import { sendEmail } from './emailService';

export const sendNotification = async (payload: SendNotificationPayload) => {
  const user = await getUserById(payload.userId);

  await sendEmail(user.email, payload.type, payload.message);

  const notification = await Notification.create({
    userId: payload.userId,
    message: payload.message,
    type: payload.type,
    status: 'sent',
  });

  return { success: true, notification };
};

export const getNotificationsByUser = async (userId: string) => {
  return Notification.find({ userId }).sort({ timestamp: -1 }).limit(10);
};

export const deleteNotification = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid notification ID');
  }
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) {
    throw new Error('Notification not found');
  }
  return { success: true, message: 'Notification deleted' };
};

export const broadcastNotification = async (payload: BroadcastPayload) => {
  const notifications = await Promise.all(
    payload.userIds.map(async (userId) => {
      try {
        const user = await getUserById(userId);
        await sendEmail(user.email, 'OrderConfirm', payload.message);
      } catch {
        console.error(`[BROADCAST] Could not fetch user or send email for userId: ${userId}`);
      }

      return Notification.create({
        userId,
        message: payload.message,
        type: 'OrderConfirm',
        status: 'sent',
      });
    })
  );

  console.log(`[BROADCAST SENT] to ${payload.userIds.length} users`);
  return { success: true, count: notifications.length, notifications };
};
