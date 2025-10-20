# Use Node.js 20 LTS Alpine
FROM node:20-alpine

# Install build tools required by better-sqlite3
RUN apk add --no-cache python3 make g++ sqlite

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --force --frozen-lockfile

# Copy all source files
COPY . .

# Build NestJS app
RUN npm run build

# Expose port (use 4000 to match main.ts)
EXPOSE 4000

# Start app
CMD ["npm", "run", "start:prod"]