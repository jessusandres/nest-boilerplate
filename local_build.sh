#!/bin/bash

echo "Building container 🤖"
docker build -t lookerdevelopers-boilerplate:latest .

echo "Running container 🚀"
docker run --name lookerdevelopers-boilerplate -d -p 8081:8080 \
  --env-file .env -e HOST=0.0.0.0 -e PORT=8080 -e DB_HOST=host.docker.internal \
  lookerdevelopers-boilerplate:latest \
