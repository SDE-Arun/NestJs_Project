# Using node.js as base image
FROM node:20.11.1 AS base

# Setting up working directory inside our container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy yarn.lock file ensures that the exact versions of the dependencies specified in it are installed
COPY yarn.lock ./

# Copy prisma here to run our below prisma generate file 
COPY prisma ./prisma

# This will make sure that the dependencies installed exactly 
# match the versions specified in the yarn.lock file
RUN yarn install --frozen-lockfile

# To generate the prisma Client
RUN npx prisma generate

# Copy only the specific part of application code to the working directory
COPY tsconfig.json ./
COPY src/ /app/src/

# Building the NestJs application
RUN yarn build

# Expose the port the app will run on
EXPOSE 3000

# Add entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Command to run the app 
ENTRYPOINT ["/app/entrypoint.sh"]
