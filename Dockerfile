# Use the official Bun image
FROM oven/bun:latest as base
WORKDIR /usr/src/app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Ensure the upload directory exists and is writable
RUN mkdir -p uploads && chmod 777 uploads

# Final image
FROM oven/bun:latest
WORKDIR /usr/src/app

COPY --from=base /usr/src/app .

# Expose the default port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the server
CMD ["bun", "run", "server.js"]
