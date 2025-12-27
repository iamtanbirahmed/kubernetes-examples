# Stage 1: Build
FROM node:24-alpine AS build

WORKDIR /usr/src/app

# Copy root lockfiles and workspace configs
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY . ./

# Build the project
RUN npx nx run command:build

# # ---

# # Stage 2: Production
FROM node:24-alpine AS production

# Set production environment
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts --omit=dev && ls

# Copy compiled code from the build stage
COPY --from=build /usr/src/app/apps/command/dist ./dist

# Use the non-root 'node' user provided by the official image for security
USER node

EXPOSE 3001

CMD ["node", "dist/main"]