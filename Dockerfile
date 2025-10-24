# Use official Node 20 base image
FROM node:20-bullseye

# Install dependencies needed for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install --force --frozen-lockfile

# Copy app files
COPY . .

# ✅ Explicitly copy certs into container (to avoid .dockerignore issues)
COPY certs ./certs

# Build the NestJS app
RUN npm run build

# Expose the app port
EXPOSE 4000

# ✅ Set environment variables properly
ENV AWS_IOT_ENDPOINT=a3m9h28ikfvc7r-ats.iot.us-east-1.amazonaws.com
ENV AWS_IOT_PRIVATE_KEY_PATH=certs/private.pem.key
ENV AWS_IOT_CERT_PATH=certs/certificate.pem.crt
ENV AWS_IOT_ROOT_CA_PATH=certs/AmazonRootCA1.pem

# Start in production mode
CMD ["npm", "run", "start:prod"]