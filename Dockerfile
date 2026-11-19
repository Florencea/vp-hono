# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.13.1

# --- Build stage ---
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies first for layer caching
COPY package.json package-lock.json .npmrc ./
RUN npm ci

# Copy source and build production bundles via project-local vp
COPY . .
RUN npm run build

# --- Deps stage: production-only dependencies ---
FROM node:${NODE_VERSION}-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev

# --- Runtime stage ---
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy built assets and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create data directory for SQLite persistence
RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "dist/server/app.js"]
