# Stage 1: Base setup
FROM node:18 AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Set environment variable to distinguish between dev and prod
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Stage 2: Production
FROM base AS production

# Build the application for production
RUN npm run build

# Use nginx to serve the production build
FROM nginx:stable-alpine AS final

# Copy build files from the production stage
COPY --from=production /app/dist /usr/share/nginx/html

# Copy custom nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the web server port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
