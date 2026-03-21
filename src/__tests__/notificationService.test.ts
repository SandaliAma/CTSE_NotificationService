import mongoose from 'mongoose';
import {
  sendNotification,
  getNotificationsByUser,
  deleteNotification,
  broadcastNotification,
} from '../services/notificationService';
import Notification from '../models/notificationModel';
import * as userServiceClient from '../clients/userServiceClient';
import * as emailService from '../services/emailService';

jest.mock('../models/notificationModel');
jest.mock('../clients/userServiceClient');
jest.mock('../services/emailService');

describe('notificationService', () => {
  afterEach(() => jest.clearAllMocks());

  describe('sendNotification', () => {
    it('should create notification and attempt email', async () => {
      (userServiceClient.getUserById as jest.Mock).mockResolvedValue({
        _id: 'u1',
        email: 'test@test.com',
        username: 'test',
      });
      (emailService.sendEmail as jest.Mock).mockResolvedValue(true);
      (Notification.create as jest.Mock).mockResolvedValue({
        userId: 'u1',
        message: 'hi',
        type: 'Welcome',
        status: 'sent',
      });

      const result = await sendNotification({ userId: 'u1', type: 'Welcome', message: 'hi' });

      expect(result.success).toBe(true);
      expect(Notification.create).toHaveBeenCalled();
    });

    it('should still create notification if user service fails', async () => {
      (userServiceClient.getUserById as jest.Mock).mockRejectedValue(new Error('unavailable'));
      (Notification.create as jest.Mock).mockResolvedValue({
        userId: 'u1',
        message: 'hi',
        type: 'Welcome',
        status: 'sent',
      });

      const result = await sendNotification({ userId: 'u1', type: 'Welcome', message: 'hi' });

      expect(result.success).toBe(true);
    });
  });

  describe('getNotificationsByUser', () => {
    it('should return notifications for user', async () => {
      const mockChain = { sort: jest.fn().mockReturnValue({ limit: jest.fn().mockResolvedValue([]) }) };
      (Notification.find as jest.Mock).mockReturnValue(mockChain);

      const result = await getNotificationsByUser('u1');

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'u1' });
      expect(result).toEqual([]);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a valid notification', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      (Notification.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: validId });

      const result = await deleteNotification(validId);

      expect(result.success).toBe(true);
    });

    it('should throw for invalid id', async () => {
      await expect(deleteNotification('invalid')).rejects.toThrow('Invalid notification ID');
    });

    it('should throw if notification not found', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      (Notification.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(deleteNotification(validId)).rejects.toThrow('Notification not found');
    });
  });

  describe('broadcastNotification', () => {
    it('should send to multiple users', async () => {
      (userServiceClient.getUserById as jest.Mock).mockResolvedValue({
        _id: 'u1',
        email: 'test@test.com',
        username: 'test',
      });
      (emailService.sendEmail as jest.Mock).mockResolvedValue(true);
      (Notification.create as jest.Mock).mockResolvedValue({ userId: 'u1', status: 'sent' });

      const result = await broadcastNotification({ message: 'hi', userIds: ['u1', 'u2'] });

      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
    });
  });
});
