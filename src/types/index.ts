export interface SendNotificationPayload {
  userId: string;
  type: 'Welcome' | 'OrderConfirm' | 'Cancellation';
  message: string;
}

export interface BroadcastPayload {
  message: string;
  userIds: string[];
}

export interface UserInfo {
  _id: string;
  email: string;
  username: string;
}
