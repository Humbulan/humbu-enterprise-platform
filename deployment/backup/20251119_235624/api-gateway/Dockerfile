FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy application code
COPY . .

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
