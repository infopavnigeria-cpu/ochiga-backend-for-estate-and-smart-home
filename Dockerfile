# Use Node.js 20 LTS Alpine for smaller image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile

# Copy all backend code
COPY . .

# Build NestJS app
RUN npm run build

# Tell EB we're listening on port 8080
ENV PORT=8080
EXPOSE 8080

# Start in production mode
CMD ["npm", "run", "start:prod"]