# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# API base URL di-bake saat build (SPA statis: runtime env TIDAK berlaku).
# CMS memakai prefix /api/cms. Override: docker build --build-arg NUXT_PUBLIC_API_BASE=https://api.domain/api/cms
ARG NUXT_PUBLIC_API_BASE=https://api.hamztech.my.id/api/cms
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

# Build the Nuxt app (SSR disabled → static output)
RUN npm run generate

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Install serve to host the static files
RUN npm install -g serve

# Copy built output from builder
COPY --from=builder /app/.output/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:3000/ || exit 1

# Start static file server
CMD ["serve", "-s", "public", "-l", "3000"]
