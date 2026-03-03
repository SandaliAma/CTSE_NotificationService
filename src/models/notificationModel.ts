import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  message: string;
  type: 'Welcome' | 'OrderConfirm' | 'Cancellation';
  status: 'sent' | 'failed';
  timestamp: Date;
}

const notificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['Welcome', 'OrderConfirm', 'Cancellation'],
    required: true,
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    default: 'sent',
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', notificationSchema);
