# Stage 1: Build
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the entire project to the working directory
COPY . .

# Build the React app
RUN yarn build

# Stage 2: Serve
FROM nginx:stable-alpine

# Set the working directory
WORKDIR /usr/share/nginx/html

# Remove the default Nginx static files
RUN rm -rf ./*

# Copy the build output from the builder stage
COPY --from=builder /app/build .

# Copy custom Nginx configuration if needed (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
