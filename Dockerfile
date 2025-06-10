FROM node:18.20.8

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies (no package-lock.json or node_modules)
RUN rm -rf package-lock.json node_modules && npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
