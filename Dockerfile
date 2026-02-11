# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy server package files first (better caching)
COPY server/package*.json ./server/

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Go back to app root
WORKDIR /app

# Copy entire project
COPY . .

# Expose port
EXPOSE 3000

# Initialize database (if not exists) and start server
CMD ["sh", "-c", "node server/init_db.js && node server/server.js"]
