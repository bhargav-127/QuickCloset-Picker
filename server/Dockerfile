# Runtime image for QuickCloset Picker backend
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY server/package*.json ./
RUN npm install --production

# Copy source
COPY server/ .

EXPOSE 3000
CMD ["node", "server.js"]
