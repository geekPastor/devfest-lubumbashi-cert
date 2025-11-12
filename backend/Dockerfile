# Use Node.js LTS version
FROM node:20-alpine

# Install fonts and dependencies for Sharp
RUN apk add --no-cache \
    fontconfig \
    ttf-dejavu \
    font-noto \
    && fc-cache -f

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 8080

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080
ENV FONTCONFIG_PATH=/etc/fonts

# Start the application
CMD ["node", "dist/index.js"]