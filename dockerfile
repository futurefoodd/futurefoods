# Use official Node.js runtime (LTS recommended)
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and lock first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy built Angular SSR app
COPY dist ./dist

# Expose the port Angular SSR will run on
EXPOSE 4000

# Set environment variables (override with docker run -e)
ENV NODE_ENV=production
ENV PORT=4000

# Run Angular SSR server
CMD ["node", "dist/nvc-web/server/server.mjs"]
