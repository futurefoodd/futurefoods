    # --- Runtime ---
    FROM node:20-alpine
    
    WORKDIR /usr/src/app
    
    # Copy only production deps
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy compiled dist from builder
    COPY dist ./dist
    
    EXPOSE 4000
    ENV NODE_ENV=production
    ENV PORT=4000
    
    CMD ["node", "dist/nvc-web/server/server.mjs"]
    