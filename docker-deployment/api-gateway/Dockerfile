FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose ports
EXPOSE 8102 8143

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8102/health || exit 1

# Start the application
CMD ["node", "index-https-simple.js"]
