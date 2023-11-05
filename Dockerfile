# Use the official lightweight Node.js 16 image.
# https://hub.docker.com/_/node
FROM node:16-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy package.json, package-lock.json, and your code to the Docker image.
COPY package*.json ./
COPY . .

# Install production dependencies.
RUN npm install --only=production

# Set environment variables, if necessary (e.g., NODE_ENV).
ENV NODE_ENV=production

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
CMD [ "node", "server.js" ]
