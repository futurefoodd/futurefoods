# --- Stage 1: Builder ---
    FROM node:20-alpine AS builder

    WORKDIR /usr/src/app
    
    # Copy package.json and install all deps (including dev)
    COPY package*.json ./
    RUN npm install
    
    # Copy full project
    COPY . .
    
    # Build Angular SSR app (production mode)
    RUN npm run build --configuration=production
    
    # --- Stage 2: Runtime ---
    FROM node:20-alpine
    
    WORKDIR /usr/src/app
    
    # Copy only production deps
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy compiled dist from builder
    COPY --from=builder /usr/src/app/dist ./dist
    
    EXPOSE 4000
    ENV NODE_ENV=production
    ENV PORT=4000
    
    CMD ["node", "dist/nvc-web/server/server.mjs"]
    