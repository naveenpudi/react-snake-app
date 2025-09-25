# Use Node.js 20
FROM node:20
 
# Set working directory
WORKDIR /app
 
# Copy package.json and package-lock.json first (better layer caching)
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of the project files
COPY . .
 
# Expose the port React dev server runs on
EXPOSE 3000
 
# Fix for Node.js 17+ (OpenSSL 3) with older webpack/react-scripts
ENV NODE_OPTIONS=--openssl-legacy-provider
 
# Default command -> run the development server
CMD ["npm", "start"]
