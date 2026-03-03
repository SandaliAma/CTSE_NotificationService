import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import notificationRoutes from './routes/notificationRoutes';
import notifyRoutes from './routes/notifyRoutes';

dotenv.config();

const app = express();
app.use(express.json());

const swaggerDoc = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// GET /notifications, DELETE /notifications/:id
app.use('/notifications', notificationRoutes);

// POST /notify/send, POST /notify/broadcast
app.use('/notify', notifyRoutes);

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI || '';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
