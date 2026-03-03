FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV PORT=3003
EXPOSE 3003

CMD ["node", "dist/index.js"]
