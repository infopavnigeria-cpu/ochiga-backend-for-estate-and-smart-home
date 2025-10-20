# Use Node.js 20 LTS on Alpine
FROM node:20-alpine

# Install dependencies required for better-sqlite3 and NestJS build
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient Docker caching)
COPY package*.json ./

# Install dependencies (avoid --force, and lock deps properly)
RUN npm ci || npm install

# Copy source code
COPY . .

# Build the NestJS app
RUN npm run build

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the port your NestJS app runs on
EXPOSE 4000

# Start the production build
CMD ["node", "dist/main.js"]