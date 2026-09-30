# Multi-stage build for Perseus (Obsessional Senior Dev Version)
# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install native build tools for better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ 

COPY package*.json ./
RUN npm ci

COPY . .

# Inject Git SHA into frontend via Vite during build
ARG GIT_SHA=undefined
ENV VITE_APP_VERSION=$GIT_SHA
RUN npm run build

# Stage 2: Runner
FROM node:20-slim
WORKDIR /app

# Runtime dependencies (sqlite3 for manual maintenance)
RUN apt-get update && apt-get install -y sqlite3 curl jq && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app ./

# Env variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_PATH=/data/perseus.db
ENV DEPLOY_VERSION=$GIT_SHA

# Ensure /data exists for volume mounting
RUN mkdir -p /data

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
