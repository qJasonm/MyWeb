#!/bin/bash

# Load from .env
export $(grep VITE_OLLAMA_URL .env)

# Build the image and inject the VITE variable
echo " Building image with VITE_OLLAMA_URL=$VITE_OLLAMA_URL"
docker build --build-arg VITE_OLLAMA_URL=$VITE_OLLAMA_URL -t myweb .

# Run the container
echo " Running container..."
docker run -p 4173:4173 --env-file .env myweb

