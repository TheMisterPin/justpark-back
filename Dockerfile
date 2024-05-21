# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (note: not pnpm-lock.yaml)
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm install

# Install TypeScript locally to ensure tsc is available
RUN npm install -D typescript

# Copy the rest of the application code
COPY . .

# Ensure all type definitions are installed
RUN npm install -D @types/node @types/body-parser @types/jsonwebtoken @types/bcryptjs @types/express @prisma/client

# Build the TypeScript code
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "dist/index.js"]
