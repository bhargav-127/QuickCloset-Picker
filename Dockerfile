# Use Node.js LTS
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy backend files
COPY server/package*.json ./server/
COPY server/server.js ./server/
COPY server/init_db.js ./server/
COPY server/data.db ./server/

# Install backend dependencies
WORKDIR /usr/src/app/server
RUN npm install

# Copy frontend files
WORKDIR /usr/src/app
COPY *.html ./
COPY css ./css
COPY js ./js

# Expose port
EXPOSE 3000

# Start server
WORKDIR /usr/src/app/server
CMD ["node", "server.js"]
