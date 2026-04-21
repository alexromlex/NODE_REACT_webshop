#!/bin/bash
set -e

if [ -f "./src/database/.db_initialized" ]; then
  echo ">>>>>> Database already initialized. Seed data skipping..."
  exit 0
fi

echo ">>>>>> Initializing database..."
npx --yes tsx ./src/database/seed-db.ts

# Create marker, delete it if delete database
touch ./src/database/.db_initialized
