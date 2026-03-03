# Bookstore Notification Service

The Notification Service handles sending notifications (order confirmations, welcome emails, cancellations, and store-wide broadcasts) within the Online Bookstore microservice application.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **API Docs:** Swagger UI (swagger-ui-express + OpenAPI 3.0)
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **SAST:** SonarCloud

## API Endpoints

| Method | Endpoint | Called By | Description |
|--------|----------|-----------|-------------|
| `POST` | `/notify/send` | Order Service / User Service | Send a notification (calls User Service for email) |
| `POST` | `/notify/broadcast` | Admin / Any Service | Send a store-wide alert to multiple users |
| `GET` | `/notifications?userId=xxx` | Client / Any Service | Get last 10 notifications for a user |
| `DELETE` | `/notifications/:id` | Client | Delete a specific notification |

### POST `/notify/send`

**Request Body:**
```json
{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "type": "OrderConfirm",
  "message": "Your order for Clean Code (LKR 2500) has been confirmed!"
}
```

**Response:**
```json
{
  "success": true,
  "notification": {
    "_id": "65a1b2c3d4e5f6a7b8c9d0e1",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "message": "Your order for Clean Code (LKR 2500) has been confirmed!",
    "type": "OrderConfirm",
    "status": "sent",
    "timestamp": "2026-03-02T10:30:00.000Z"
  }
}
```

### POST `/notify/broadcast`

**Request Body:**
```json
{
  "message": "Big Sale is Live! 50% off on all books!",
  "userIds": ["user1", "user2", "user3"]
}
```

### GET `/notifications?userId=user123`

Returns the last 10 notifications for the given user.

### DELETE `/notifications/:id`

Deletes a specific notification by its MongoDB ObjectId.

## Database Schema (notification_db)

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Primary key |
| `userId` | String | Recipient ID (used to look up email from User Service) |
| `message` | String | The actual content of the notification |
| `type` | String | Enum: `Welcome`, `OrderConfirm`, `Cancellation` |
| `status` | String | Enum: `sent`, `failed` |
| `timestamp` | Date | When the notification was processed |

## Inter-Service Communication

All inter-service communication goes through the **API Gateway** — services never call each other directly.

```
                         ┌──────────────────────┐
                         │     API Gateway       │
                         └──┬───────┬───────┬────┘
                            │       │       │
          ┌─────────────────┘       │       └─────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐   ┌────────────────────┐   ┌────────────────────────┐
│   User Service   │   │   Order Service    │   │  Book Catalog Service  │
└──────────────────┘   └────────────────────┘   └────────────────────────┘
          ▲                    │       │
          │                    │       │  POST /notify/send
          │                    │       ▼
          │                    │  ┌──────────────────────────┐
          └────────────────────┴──│  Notification Service    │
   GET /users/:id                 │  (this service)          │
                                  └──────────────────────────┘
```

### Incoming Calls (who calls this service)

| Caller | Endpoint | When |
|--------|----------|------|
| **Order Service** → Gateway → Notification Service | `POST /notify/send` | Order placed or cancelled |
| **User Service** → Gateway → Notification Service | `POST /notify/send` | New user registers (Welcome) |

### Outgoing Calls (this service calls)

| Target | Endpoint | Why |
|--------|----------|-----|
| Notification Service → Gateway → **User Service** | `GET /users/:userId` | Fetch user's email to send notification |

## Project Structure

```
src/
├── index.ts                          # Express app entry point + Swagger setup
├── routes/
│   ├── notificationRoutes.ts         # GET /notifications, DELETE /notifications/:id
│   └── notifyRoutes.ts               # POST /notify/send, POST /notify/broadcast
├── controllers/
│   └── notificationController.ts     # Request/response handling
├── services/
│   └── notificationService.ts        # Business logic
├── models/
│   └── notificationModel.ts          # Mongoose schema
├── clients/
│   └── userServiceClient.ts          # HTTP client to call User Service via Gateway
├── types/
│   └── index.ts                      # TypeScript interfaces
└── middleware/                        # Auth middleware (if needed)
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the service runs on | `3003` |
| `MONGODB_URI` | MongoDB Atlas connection string | — |
| `API_GATEWAY_URL` | URL of the API Gateway | `http://localhost:3000` |
| `INTERNAL_API_KEY` | Shared key for inter-service auth | — |

See `.env.example` for reference.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Run Locally

```bash
npm install
npm run dev
```

The service runs at `http://localhost:3003`.
Swagger docs are available at `http://localhost:3003/api-docs`.

### Build for Production

```bash
npm run build
npm start
```

### Run with Docker

```bash
docker build -t bookstore-notification-service .
docker run -p 3003:3003 --env-file .env bookstore-notification-service
```

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on every push to `main`:

1. **Checkout** code
2. **Install** dependencies and **build** TypeScript
3. **Build** Docker image and **push** to Docker Hub
4. **Scan** code with SonarCloud (SAST)
5. **Deploy** to Render via deploy hook

### Required GitHub Secrets

| Secret | Where to get it |
|--------|-----------------|
| `DOCKER_USERNAME` | Docker Hub account |
| `DOCKER_PASSWORD` | Docker Hub access token |
| `SONAR_TOKEN` | SonarCloud → My Account → Security |
| `RENDER_DEPLOY_HOOK` | Render dashboard → Service → Settings → Deploy Hook |
