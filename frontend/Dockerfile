# ========================
# Base stage (common deps)
# ========================
FROM node:20-alpine AS base
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# ========================
# Development stage
# ========================
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ========================
# Builder stage
# ========================
FROM base AS builder
RUN npm run build

# ========================
# Production stage
# ========================
FROM node:20-alpine AS production
WORKDIR /app

# Install only "serve"
RUN npm install -g serve

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
