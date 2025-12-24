# DFD Automation - Optimized for Railway
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip Puppeteer predownload)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
