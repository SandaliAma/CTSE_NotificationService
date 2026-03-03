import mongoose from 'mongoose';
import { getUserById } from '../clients/userServiceClient';
import Notification from '../models/notificationModel';
import { SendNotificationPayload, BroadcastPayload } from '../types';

export const sendNotification = async (payload: SendNotificationPayload) => {
  // Call User Service via Gateway to get recipient's email
  const user = await getUserById(payload.userId);

  const notification = await Notification.create({
    userId: payload.userId,
    message: payload.message,
    type: payload.type,
    status: 'sent',
  });

  console.log(`[NOTIFICATION SENT] to: ${user.email}`, notification);
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
