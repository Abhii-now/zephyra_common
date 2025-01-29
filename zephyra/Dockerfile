# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
# Build the React application
RUN npm run build

# Use an official Nginx image to serve the build
FROM nginx:alpine

# Copy the build output to the Nginx HTML directory
COPY --from=build /app/build /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html

# Copy SSL certificates
COPY certs/cert.pem /etc/ssl/certs/cert.pem
COPY certs/key.pem /etc/ssl/private/key.pem

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
# Create cache directory for Nginx
RUN mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/cache/nginx

EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]