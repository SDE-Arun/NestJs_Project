# Using node.js as base image
FROM node:20.11.1 AS base

# Setting working directory inside our container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy yarn.lock file ensures that the exact versions of the dependencies specified in it are installed
COPY yarn.lock ./

# This will make sure that the dependencies installed exactly 
# match the versions specified in the yarn.lock file
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the working directory
COPY . .

# Building the NestJs application
RUN yarn build

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app 
CMD ["node", "dist/main.js"]