FROM node:18-alpine

# Install dumb-init and necessary packages
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

# Copy package.json and lock file first for cache
COPY package*.json ./

# Install only production deps
RUN npm ci && npm cache clean --force

# Copy everything else
COPY . .

# Force TypeScript build
RUN npm run build:force || true

# Permissions fix
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 8080

ENTRYPOINT ["dumb-init", "--"]

# Run production server
CMD ["npm", "start"]
