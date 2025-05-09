#!/bin/sh
echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
node dist/main.js
