import { Request, Response } from 'express';
import { send, getNotifications, remove, broadcast } from '../controllers/notificationController';
import * as notificationService from '../services/notificationService';

jest.mock('../services/notificationService');

const mockRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('notificationController', () => {
  afterEach(() => jest.clearAllMocks());

  describe('send', () => {
    it('should return 200 on success', async () => {
      const req = { body: { userId: 'u1', type: 'Welcome', message: 'hi' } } as Request;
      const res = mockRes();
      (notificationService.sendNotification as jest.Mock).mockResolvedValue({ success: true });

      await send(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 500 on error', async () => {
      const req = { body: {} } as Request;
      const res = mockRes();
      (notificationService.sendNotification as jest.Mock).mockRejectedValue(new Error('fail'));

      await send(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getNotifications', () => {
    it('should return 400 if no userId', async () => {
      const req = { query: {} } as unknown as Request;
      const res = mockRes();

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 200 with notifications', async () => {
      const req = { query: { userId: 'u1' } } as unknown as Request;
      const res = mockRes();
      (notificationService.getNotificationsByUser as jest.Mock).mockResolvedValue([]);

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 on error', async () => {
      const req = { query: { userId: 'u1' } } as unknown as Request;
      const res = mockRes();
      (notificationService.getNotificationsByUser as jest.Mock).mockRejectedValue(new Error('fail'));

      await getNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('remove', () => {
    it('should return 200 on success', async () => {
      const req = { params: { id: '123' } } as unknown as Request;
      const res = mockRes();
      (notificationService.deleteNotification as jest.Mock).mockResolvedValue({ success: true });

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 on error', async () => {
      const req = { params: { id: 'bad' } } as unknown as Request;
      const res = mockRes();
      (notificationService.deleteNotification as jest.Mock).mockRejectedValue(new Error('not found'));

      await remove(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('broadcast', () => {
    it('should return 200 on success', async () => {
      const req = { body: { message: 'hi', userIds: ['u1'] } } as Request;
      const res = mockRes();
      (notificationService.broadcastNotification as jest.Mock).mockResolvedValue({ success: true, count: 1 });

      await broadcast(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 on error', async () => {
      const req = { body: {} } as Request;
      const res = mockRes();
      (notificationService.broadcastNotification as jest.Mock).mockRejectedValue(new Error('fail'));

      await broadcast(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
