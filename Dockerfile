# Backend Dockerfile
FROM node:20

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all backend code
COPY . .

# Expose backend port
EXPOSE 3000

# Start NestJS in dev mode (you can change to start:prod later)
CMD ["npm", "run", "start:dev"]
